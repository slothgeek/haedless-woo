'use client';

import { createContext, useState, useEffect, useContext } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ApolloProvider } from '@apollo/client';
import client from '@/lib/graphql/apollo-client';
import { useAuth } from '@/hooks/useAuth';


export function HeroWrapper({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider />
            {children}
        </HeroUIProvider>
    )
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

export const AccountContext = createContext<any | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
    const { userData, isLoading: authLoading, isAuthenticated } = useAuth();
    const [sessionToken, setSessionToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('woocommerce-session');
        if (token) {
            setSessionToken(token);
        }
    }, []);

    return (
        <AccountContext.Provider value={{ userData, authLoading, isAuthenticated, sessionToken }}>{children}</AccountContext.Provider>
    )
}

export const useSession = () => useContext(AccountContext);