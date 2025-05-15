'use client'

import { gql, useQuery } from '@apollo/client';
import { Input, Button } from "@heroui/react";
import { LuArrowRight } from 'react-icons/lu';
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin, FaGoogle } from "react-icons/fa";
import { usePasswordLogin } from '@/hooks/usePasswordLogin';
import Link from 'next/link';
import { useState } from 'react';


const GET_PROVIDERS = gql`query LoginClients {
    loginClients {
      authorizationUrl
      provider
      name
      isEnabled
    }
  }`

export default function LoginForm() {
    const { data, loading, error } = useQuery(GET_PROVIDERS);

    const [usernameEmail, setUsernameEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, isLoading, errors } = usePasswordLogin(); // We'll define this hook later.

    if (loading) return <div className='animate-pulse'>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Filter out the disabled clients.
    const enabledClients = data?.loginClients?.filter((client: any) => client?.isEnabled) || [];

    // Get the Oauth2 Clients.
    const oauthClients = enabledClients.filter((client: any) => client?.authorizationUrl);


    const submitPassword = (e: any) => {
        e.preventDefault()

        login(usernameEmail, password, '/account')
    }

    const AuthIcon = (provider: string) => {
        switch (provider) {
            case 'GOOGLE':
                return <FaGoogle className='w-5 h-5' />
            case 'GITHUB':
                return <FaGithub className='w-5 h-5' />
            case 'FACEBOOK':
                return <FaFacebook className='w-5 h-5' />
            case 'INSTAGRAM':
                return <FaInstagram className='w-5 h-5' />
            case 'LINKEDIN':
                return <FaLinkedin className='w-5 h-5' />
        }
    }

    return (
        <>
            <div className='space-y-4 border-foreground border-1 rounded-lg p-6 mx-2 w-xs' >
                <h1 className='text-2xl font-bold mb-10'>Iniciar sesión</h1>
                <div>
                    <form onSubmit={submitPassword} className="space-y-6">
                        <div className="space-y-10">
                            <Input
                                type="email"
                                name="username"
                                placeholder="your@email.com"
                                label="Correo electrónico"
                                labelPlacement='outside'
                                value={usernameEmail}
                                onChange={(e) => setUsernameEmail(e.target.value)}
                            />
                            <Input
                                type="password"
                                name="password"
                                label="Contraseña"
                                placeholder='********'
                                labelPlacement='outside'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errors && <div className='text-red-500 text-sm text-center'>{errors.message}</div>}
                        <Button
                            type="submit"
                            variant="solid"
                            color="primary"
                            className='w-full'
                            endContent={<LuArrowRight />}
                        >
                            Iniciar sesión
                        </Button>
                    </form>
                </div>
                <div className='border-t-1 border-foreground my-6'></div>
                <div className='flex flex-col gap-2 items-center'>
                    {
                        oauthClients?.length && oauthClients.map(
                            (client: any) => (
                                <Button
                                    key={client.provider}
                                    as={Link}
                                    href={client.authorizationUrl}
                                    color='default'
                                    className='w-full'
                                    startContent={AuthIcon(client.provider)}
                                >
                                    Ingresar con {client.name}
                                </Button>
                            )
                        )
                    }
                </div>
                <div className='flex flex-col gap-2 items-center'>
                    <Link href="/recover" className='text-sm text-foreground'>¿Olvidaste tu contraseña?</Link>
                </div>
            </div>
            <div className='flex flex-col gap-2 items-center'>
                <Link href="/signup">¿No tienes una cuenta? Regístrate</Link>
            </div>
        </>
    )
}