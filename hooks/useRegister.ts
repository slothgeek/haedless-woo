'use client'

import { useState } from 'react'
import { RegisterData } from '@/lib/utils/definitions'

interface RegisterError {
    message: string;
    code?: string;
}

export function useRegister() {
    const [registerErrors, setRegisterErrors] = useState<RegisterError | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState<RegisterData | undefined>();

    const register = async (email: string, password: string, firstName: string, lastName: string, provider?: string, redirectTo?: string) => {
        setIsLoading(true);

        const registerUrl = '/api/auth/register/' + provider;

        try {
            const res = await fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, firstName, lastName }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setRegisterErrors(errorData);
                return;
            }

            const data = await res.json();
            setUserData(data);

            console.log('Usuario registrado:', data);

            setIsLoading(false);

            // If we get here, the login was successful, so let's redirect.
            if (redirectTo) {
                window.location.assign(redirectTo);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setRegisterErrors({ message: 'Error al registrar el usuario' });
        } finally {
            setIsLoading(false);
        }
    }

    return { register, registerErrors, isLoading, userData }
}


