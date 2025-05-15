'use client';

import { Form, Button, Input } from '@heroui/react';
import { useState, useContext } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import usePasswordChange from '@/hooks/usePasswordChange';
import { AccountContext } from '@/providers';
import { PasswordChangeFormData, passwordChangeSchema } from '@/types/password';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function PasswordChangeForm() {
    const { userData } = useContext(AccountContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { updateLoading, handleSubmit } = usePasswordChange(userData?.databaseId);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = useForm({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (data: PasswordChangeFormData) => {
        try {
            const updated = await handleSubmit(data);

            if (updated) {
                reset(); // Limpia el formulario después de un submit exitoso
            }
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
        }
    };
    //"asdasdasdasd"
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Actualización de contraseña</h2>

            <Form className="w-full space-y-4" onSubmit={handleFormSubmit(onSubmit)}>
                <Controller 
                    name="newPassword"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Input
                            {...field}
                            value={value || ''}
                            onChange={onChange}
                            label="Nueva contraseña"
                            type={showPassword ? 'text' : 'password'}
                            endContent={<Button isIconOnly variant="light" onPress={() => setShowPassword(!showPassword)}>{showPassword ? <LuEye /> : <LuEyeOff />}</Button>}
                            aria-invalid={!!errors.newPassword}
                            errorMessage={errors.newPassword?.message}
                        />
                    )}
                />
                <Controller 
                    name="confirmPassword"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <Input
                            {...field}
                            value={value || ''}
                            onChange={onChange}
                            label="Confirmar contraseña"
                            type={showConfirmPassword ? 'text' : 'password'}
                            endContent={<Button isIconOnly variant="light" onPress={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <LuEye /> : <LuEyeOff />}</Button>}
                        />
                    )}
                />
                <Button className='w-full' color="primary" type="submit" isLoading={updateLoading} isDisabled={updateLoading}>Cambiar contraseña</Button>
            </Form>
        </div>
    );
}