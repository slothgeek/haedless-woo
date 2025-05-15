'use server'

import { _fetch } from '../utils/api'
import { JwtPayload, decode } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function authenticate(variables: any) {
    try {
        // Validar que las variables necesarias estén presentes
        if (!variables?.input) {
            throw new Error('Se requieren credenciales de inicio de sesión');
        }

        /*
        console.log('Intentando autenticar con:', {
            provider: variables.input.provider,
            hasCredentials: !!variables.input.credentials,
            hasOAuthResponse: !!variables.input.oauthResponse
        });
        */

        const response = await _fetch(
            `
            mutation Login($input: LoginInput!) {
                login(input: $input) {
                    authToken
                    refreshToken
                    wooSessionToken
                    user {
                        id
                        databaseId
                        email
                        firstName
                        lastName
                        roles {
                            nodes {
                            id
                            name
                            }
                        }
                    }
                }
            }
            `,
            variables
        );

        if (response?.errors) {
            console.error('Errores de GraphQL:', response.errors);
            return {
                error: response.errors[0].message
            }
        }

        if (!response?.data?.login) {
            throw new Error('No se recibieron datos de autenticación');
        }
        return response.data.login;
    } catch (error) {
        throw error;
    }
}

export async function register(variables: any) {
    try {
        // Validar que las variables necesarias estén presentes
        if (!variables?.input) {
            throw new Error('Se requieren credenciales de registro');
        }

        const response = await _fetch(
            `
            mutation Register($input: RegisterCustomerInput!) {
                registerCustomer(input: $input) {
                    authToken
                    refreshToken
                    customer {
                        id
                        databaseId
                        email
                        firstName
                        lastName
                        role
                    }
                }
            }
            `,
            variables
        );

        if (response?.errors) {
            console.error('Errores de GraphQL:', response.errors);
            throw new Error(response.errors[0].message);
        }

        if (!response?.data?.registerCustomer) {
            throw new Error('No se recibieron datos de registro');
        }

        return response.data.registerCustomer;
    } catch (error) {
        console.error('Error en register:', error);
        throw error;
    }
}

// Función para verificar si el token ha expirado
export async function isTokenExpired(token: string): Promise<boolean> {
    try {
        const decodedToken = decode(token) as JwtPayload;

        if (!decodedToken?.exp) {
            return false;
        }

        const expiresAt = new Date(decodedToken.exp * 1000);
        const now = new Date();

        return now.getTime() > expiresAt.getTime();
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return true;
    }
}

// Función para refrescar el token de autenticación
export async function refreshAuthToken(refreshToken: string) {
    try {
        const response = await _fetch(
            `
            mutation RefreshAuthToken($refreshToken: String!) {
                refreshToken(input: { refreshToken: $refreshToken }) {
                    authToken
                    success
                }
            }
            `,
            { refreshToken }
        );

        if (response?.errors) {
            throw new Error(response.errors[0].message);
        }

        return response?.data?.refreshToken;
    } catch (error) {
        console.error('Error al refrescar token:', error);
        throw error;
    }
}

export async function getUser(req: NextRequest, sessionToken: string) {

    if (!sessionToken) {
        return null;
    }

    const user = req.cookies.get('user')?.value;

    if (user) {
        return JSON.parse(user);
    }

    const decodedToken = decode(sessionToken) as JwtPayload;

    const userId = decodedToken.data.user.id;

    const response = await _fetch(
        `
        query GetUser($id: ID = "") {
            user(id: $id, idType: DATABASE_ID) {
                email
                firstName
                id
                lastName
                databaseId
                roles {
                    nodes {
                        name
                    }
                }
            }
        }
        `,
        { id: userId },
        sessionToken
    );

    return response?.data?.user;
}