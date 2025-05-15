'use server'

import { headers } from 'next/headers';

export async function _fetch(query: string, variables: any, token?: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    

    if (!baseUrl) {
        throw new Error('NEXT_PUBLIC_BACKEND_URL no está configurada');
    }

    const requestHeaders: Record<string, string> = { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'
    };
    
    if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    console.log('Request Headers:', requestHeaders);

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: requestHeaders,
            credentials: 'include',
            body: JSON.stringify({
                query,
                variables
            })
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error en la petición GraphQL: ${response.statusText}. Detalles: ${errorText}`);
        }

        const data = await response.json();
        //console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('Error en _fetch:', error);
        throw error;
    }
}