'use client'
import { useState } from 'react'
import {Input, Button} from '@heroui/react'
import { useForm } from 'react-hook-form'
import { useRecoverPassword } from '@/hooks/useRecoverPassword'

export default function RecoverForm() {
    const { handleRecoverPassword, loading, error } = useRecoverPassword();
    const [result, setResult] = useState<any>(null);
    const { register, handleSubmit, reset } = useForm();

    const submitForm = async (data: any) => {
        const email = data.email;

        const result = await handleRecoverPassword(email);

        if (result?.success) {
            reset();
            setResult(result);
        }
    }
    
    return (
        <>
            <div className='space-y-4 border-foreground border-1 rounded-lg p-6 mx-2 w-full max-w-lg'>
            <h1 className='text-2xl font-bold mb-10'>Recuperar contraseña</h1>
                <div>
                    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                        <p><strong>¿Necesitas recuperar tu contraseña?</strong></p>
                        <p>Ingresa tu correo electrónico y te enviaremos un enlace para crear una nueva contraseña.</p>
                        <Input {...register('email')} placeholder='Correo electrónico' />
                        <Button type="submit" color="primary">Recuperar contraseña</Button>
                        {result?.message && <p className='text-sm text-green-500'>{result.message}</p>}
                    </form>
                </div>
            </div>
        </>
    )
}