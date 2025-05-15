import { SessionOptions, getIronSession, IronSessionData } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server';

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_COOKIE_PASSWORD || '',
    cookieName: 'wp-graphql-headless-login-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        domain: '.woo.local'
    },
}

declare module 'iron-session' {
    interface IronSessionData {
        cookieVariable?: string;
    }
}

const getSession = async (req: NextRequest, res: NextResponse) => {
    const session = getIronSession<IronSessionData>(req, res, sessionOptions)
    return session
}


export {
    getSession
}