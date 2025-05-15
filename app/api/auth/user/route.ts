// pages/api/auth/user.js
import { NextRequest, NextResponse } from 'next/server';
import { _fetch } from '@/lib/utils/api';
import { isTokenExpired, getUser, refreshAuthToken } from '@/lib/graphql/authenticate';
// Manejador principal de la ruta
export async function GET(req: NextRequest) {
    try {
        // Obtener el token de la cookie
        const sessionToken = req.cookies.get('session')?.value;
        const refreshToken = req.cookies.get('refreshToken')?.value;

        // Si no hay token, el usuario no está autenticado
        if (!sessionToken) {
            return NextResponse.json(
                {
                    error: 'Usuario no autenticado',
                    isLoggedIn: false
                },
                { status: 401 }
            );
        }
        // Si el token ha expirado y tenemos refresh token, intentar refrescarlo
        if (await isTokenExpired(sessionToken) && refreshToken) {
            try {
                const newTokens = await refreshAuthToken(refreshToken);

                if (!newTokens?.authToken) {
                    // Si no se pudo refrescar el token, eliminar las cookies
                    const response = NextResponse.json(
                        {
                            error: 'Sesión expirada',
                            isLoggedIn: false
                        },
                        { status: 401 }
                    );
                    response.cookies.delete('session');
                    response.cookies.delete('refreshToken');
                    return response;
                }
                const user = await getUser(req, newTokens.authToken)
                // Si se refrescó el token, actualizar las cookies
                const response = NextResponse.json(
                    {
                        isLoggedIn: true,
                        user: user
                    },
                    { status: 200 }
                );
                // Configurar las cookies con los nuevos tokens
                response.cookies.set({
                    name: 'session',
                    value: newTokens.authToken,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7,
                    domain: '.woo.local'
                });

                if (newTokens.refreshToken) {
                    response.cookies.set({
                        name: 'refreshToken',
                        value: newTokens.refreshToken,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 30,
                        domain: '.woo.local'
                    });
                }

                return response;
            } catch (error) {
                console.error('Error al refrescar el token:', error);
                const response = NextResponse.json(
                    {
                        error: 'Error al refrescar la sesión',
                        isLoggedIn: false
                    },
                    { status: 401 }
                );
                response.cookies.delete({name: 'session', domain: '.woo.local'});
                response.cookies.delete({name: 'refreshToken', domain: '.woo.local'});
                response.cookies.delete({name: 'user', domain: '.woo.local'});
                response.cookies.delete({name: 'wp-graphql-headless-login-session', domain: '.woo.local'});
                return response;
            }
        }

        
        const user = await getUser(req, sessionToken);
        //console.log('user', user);
        // Si llegamos aquí, el token es válido
        return NextResponse.json(
            {
                isLoggedIn: true,
                user: user
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return NextResponse.json(
            {
                error: 'Error interno del servidor',
                isLoggedIn: false
            },
            { status: 500 }
        );
    }
}
