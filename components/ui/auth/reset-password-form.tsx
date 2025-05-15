'use client';

import { useState } from 'react';
import { Input, Button } from '@heroui/react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import usePasswordChange from '@/hooks/usePasswordChange';
import { useRouter } from 'next/navigation';


export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const key = searchParams.get('key') || '';
    const login = searchParams.get('login') || '';
    const router = useRouter();
    if (!key || !login) {
        return <div>Parámetros inválidos</div>;
    }

    const { register, handleSubmit } = useForm();
    
    const { handleResetPassordWithKey, resetLoading } = usePasswordChange(0);

    const submitForm = async (data: any) => {

        const result = await handleResetPassordWithKey(key, login, data.password);

        if (result) {
            router.push('/signin');
        }
    }

    
    return (
        <div className='space-y-4 border-foreground border-1 rounded-lg p-6 mx-2 w-lg' >
            <h1 className='text-2xl font-bold mb-10'>Cambiar contraseña</h1>
            <div>
                <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                    <Input {...register('password')} placeholder='Nueva Contraseña' />
                    <Button type="submit" color="primary">Cambiar contraseña</Button>
                </form>
            </div>
        </div>
    )
}
