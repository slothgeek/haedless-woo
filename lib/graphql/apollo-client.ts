import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

// 1. Enlace para agregar el token de sesión a las cabeceras
const sessionLink = setContext((_, { headers }) => {
    if (typeof window === 'undefined') return { headers };

    const sessionToken = localStorage.getItem('woocommerce-session');

    return {
        headers: {
            ...headers,
            ...(sessionToken ? { 'woocommerce-session': `Session ${sessionToken}` } : {}),
        },
    };
});

// 2. Enlace de autenticación existente
const authLink = setContext(async (_, { headers }) => {
    try {
        // Obtener el token a través del endpoint
        const response = await fetch('/api/auth/token', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            return { headers };
        }

        const data = await response.json();
        const token = data.token;

        // Devolver los headers con los tokens si existen
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ""
            }
        }
    } catch (error) {
        console.error('Error al obtener el token:', error);
        return { headers };
    }
});

// 3. Afterware para capturar y almacenar el nuevo token de sesión
const sessionAfterware = new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
        if (typeof window !== 'undefined') {
            const context = operation.getContext();
            const session = context.response?.headers?.get('woocommerce-session');
            if (session) {
                localStorage.setItem('woocommerce-session', session);
            }
        }
        return response;
    });
});

// 4. Enlace HTTP hacia el servidor GraphQL
const httpLink = createHttpLink({
    uri: BACKEND_URL,
    credentials: 'include',
});

const client = new ApolloClient({
    link: from([sessionLink, authLink, sessionAfterware, httpLink]),
    cache: new InMemoryCache(),
});

export default client;