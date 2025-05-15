import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/lib/graphql/authenticate';

interface OAuthResponse {
    code: string | null;
    state?: string;
}


export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
    try {

        const provider = params.provider;

        if (!provider) {
            return NextResponse.json(
                { error: 'Proveedor de registro no especificado' },
                { status: 400 }
            );
        }

        const variables = await getProviderInput(provider, req);

        const data = await register(variables);

        if (!data?.customer) {
            return NextResponse.json(
                { error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Crear la respuesta con la cookie de sesión
        const response = NextResponse.json(
            { user: data.customer, isLoggedIn: true },
            { status: 200 }
        );

        // Configurar la cookie de sesión
        response.cookies.set({
            name: 'session',
            value: data.authToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 días
        });

        response.cookies.set({
            name: 'user',
            value: JSON.stringify(data.customer),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        // Configurar la cookie de refresh token
        if (data.refreshToken) {
            response.cookies.set({
                name: 'refreshToken',
                value: data.refreshToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30 // 30 días
            });
        }

        return response;

    } catch (error: any) {
        console.error('Error en la registrar:', error);
        return NextResponse.json(
            { error: error.message || 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

async function getProviderInput(provider: string, req: NextRequest) {
    const providerEnum = provider.toUpperCase();

    switch (providerEnum) {
        case 'EMAIL':
            const body = await req.json();
            return {
                input: {
                    email: body.email,
                    username: body.email,
                    password: body.password,
                    firstName: body.firstName,
                    lastName: body.lastName,
                }
            };
        // All OAuth2 Provider share the same input shape.
        default:
            const url = new URL(req.url);
            return {
                input: {
                    provider: providerEnum,
                    oauthResponse: {
                        code: url.searchParams.get('code'),
                    } as OAuthResponse,
                }
            };
    }
}