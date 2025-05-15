import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/graphql/authenticate';
import { getSession } from '@/lib/session';
interface OAuthResponse {
  code: string | null;
  state?: string;
}

export async function POST(req: NextRequest,{ params }: { params: { provider: string } }) {
  try {
      const {provider} = await params;
      
      if (!provider) {
          return NextResponse.json(
              { error: 'Proveedor de autenticación no especificado' },
              { status: 400 }
          );
      }

      const variables = await getProviderInput(provider, req);
      //console.log('Variables de autenticación:', variables);
      
      const data = await authenticate(variables);

      if (!data?.user) {
          return NextResponse.json(
              { error: 'Credenciales inválidas' },
              { status: 401 }
          );
      }

      // Crear la respuesta con la cookie de sesión
      const response = NextResponse.json(
          { user: data.user, isLoggedIn: true },
          { status: 200 }
      );

      console.log('Datos de autenticación:', data);

      // Configurar la cookie de sesión
      response.cookies.set({
          name: 'session',
          value: data.authToken,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          domain: '.woo.local'
      });

      response.cookies.set({  
        name: 'wooSessionToken',
        value: data.wooSessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        domain: '.woo.local'
      });

      response.cookies.set({
          name: 'user',
          value: JSON.stringify(data.user),
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          domain: '.woo.local'
      });

      // Configurar la cookie de refresh token
      if (data.refreshToken) {
          response.cookies.set({
              name: 'refreshToken',
              value: data.refreshToken,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 30,
              domain: '.woo.local'
          });
      }

      return response;
  } catch (error: any) {
      console.error('Error en la autenticación:', error);
      return NextResponse.json(
          { error: error.message || 'Error interno del servidor' },
          { status: 500 }
      );
  }
}

async function getProviderInput(provider: string, req: NextRequest) {
    const providerEnum = provider.toUpperCase();
  
    switch (providerEnum) {
      case 'PASSWORD':
        const body = await req.json();
        return {
          input: {
            provider: providerEnum,
            credentials: {
              username: body.username,
              password: body.password,
            },
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