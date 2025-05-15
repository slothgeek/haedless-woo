import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired, refreshAuthToken } from '@/lib/graphql/authenticate';

export async function GET(req: NextRequest) {
    try {
        const sessionToken = req.cookies.get('session')?.value;
        const wooSessionToken = req.cookies.get('wooSessionToken')?.value;

        if (!sessionToken) {
            return NextResponse.json({ error: 'No hay sesión activa' }, { status: 401 });
        }

        if (await isTokenExpired(sessionToken)) {
            try {
                const refreshToken = req.cookies.get('refreshToken')?.value;
                if (refreshToken) {
                    const newTokens = await refreshAuthToken(refreshToken);

                    if (!newTokens?.authToken) {
                        return NextResponse.json(
                            { error: 'Sesión expirada' },
                            { status: 401 }
                        );
                    }

                    return NextResponse.json(
                        { token: newTokens.authToken },
                        { status: 200 }
                    );
                }
            } catch (error) {
                console.error('Error al refrescar el token:', error);
                return NextResponse.json(
                    { error: 'Error al refrescar el token' },
                    { status: 500 }
                );
            }
        }
        
        return NextResponse.json({
            token: sessionToken,
            wooSessionToken: wooSessionToken
        });
    } catch (error: any) {
        console.error('Error al obtener el token:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
} 