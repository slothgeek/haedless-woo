// pages/api/auth/logout.js
import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json(
        { message: 'Sesión cerrada correctamente' },
        { status: 200 }
    );

    // Eliminar la cookie de sesión
    response.cookies.delete({name: 'session', domain: '.woo.local'});
    response.cookies.delete({name: 'wooSessionToken', domain: '.woo.local'});
    response.cookies.delete({name: 'user', domain: '.woo.local'});
    response.cookies.delete({name: 'refreshToken', domain: '.woo.local'});
    return response;
}