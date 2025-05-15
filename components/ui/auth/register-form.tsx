'use client'

import { gql, useQuery } from '@apollo/client';

import { useState } from "react"
import { useRegister } from '@/hooks/useRegister';
import { Input, Button } from "@heroui/react"
import { LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin, FaGoogle } from "react-icons/fa";

const GET_PROVIDERS = gql`query LoginClients {
    loginClients {
      authorizationUrl
      provider
      name
      isEnabled
    }
  }`

export default function RegisterForm() {
    const { data, loading, error } = useQuery(GET_PROVIDERS);
    const { register, registerErrors, isLoading } = useRegister();
    if (loading) return <div className='animate-pulse'>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    // Filter out the disabled clients.
    const enabledClients = data?.loginClients?.filter((client: any) => client?.isEnabled) || [];

    // Get the Oauth2 Clients.
    const oauthClients = enabledClients.filter((client: any) => client?.authorizationUrl);
    const submit = (e: any) => {
        e.preventDefault()
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');

        if (!email || !password || !firstName || !lastName) {
            console.log('Faltan datos')
            return
        }

        register(email as string, password as string, firstName as string, lastName as string, 'email', '/account')
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

    return <>
        <div className='space-y-4 border-foreground border-1 rounded-lg p-6 mx-2 w-lg' >
            <h1 className='text-2xl font-bold mb-10'>Crear cuenta</h1>
            <div>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-10">
                        <div className='flex gap-4'>
                            <Input
                                type="text"
                                name="firstName"
                                placeholder="Ingresa tu nombre"
                                label="Nombre"
                                labelPlacement="outside"
                            />
                            <Input
                                type="text"
                                name="lastName"
                                placeholder="Ingresa tu apellido"
                                label="Apellido"
                                labelPlacement="outside"
                            />
                        </div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            label="Correo electrónico"
                            labelPlacement='outside'
                            required
                        />
                        <Input
                            type="password"
                            name="password"
                            label="Contraseña"
                            placeholder='********'
                            labelPlacement='outside'
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="solid"
                        color="primary"
                        className='w-full'
                        endContent={<LuArrowRight />}
                        isLoading={isLoading}
                    >
                        Crear cuenta
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

        </div>
        <div className='flex flex-col gap-2 items-center'>
            <Link href="/signin">¿Ya tienes una cuenta? Ingresa</Link>
        </div>
    </>
}