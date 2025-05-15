'use client';

import { useContext, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema } from '@/types/profile';

import { Form, Input, Button } from '@heroui/react';
import { useProfile } from '@/hooks/useProfile';
import { AccountContext } from '@/providers';

export default function ProfileForm() {
    const { userData } = useContext(AccountContext);

    const { profileData, loading, error, updateLoading, handleSubmit } = useProfile(userData?.databaseId);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        }
    });

    useEffect(() => {
        if (profileData) {
            console.log(profileData);
            Object.entries(profileData).forEach(([key, value]) => {
                setValue(key as any, value);
            });
        }
    }, [profileData]);

    if (loading) return (
        <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="p-4 bg-red-50 text-red-700 rounded-md" role="alert">
            Error: {error.message}
        </div>
    );

    const onSubmit = async (data: any) => {
        const result = profileFormSchema.safeParse(data);
        if (!result.success) {
            const errors = result.error.errors;
            errors.forEach(error => {
                const field = error.path[0];
                setValue(field as any, data[field], { shouldValidate: true });
            });
            return;
        }
        await handleSubmit(result.data);
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className=" font-bold mb-6">Detalles de la cuenta</h2>
            <Form className='w-full space-y-4' onSubmit={handleFormSubmit(onSubmit)}>
                <div className="w-full grid grid-cols-2 gap-4">
                    <div>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                    {...field}
                                    value={value || ''}
                                    onChange={onChange}
                                    label="Nombre"
                                    aria-invalid={!!errors.firstName}
                                    errorMessage={errors.firstName?.message}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field: { onChange, value, ...field } }) => (
                                <Input
                                    {...field}
                                    value={value || ''}
                                    onChange={onChange}
                                    label="Apellido"
                                    aria-invalid={!!errors.lastName}
                                    errorMessage={errors.lastName?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Input {...field} value={value || ''} onChange={onChange} label="Email" aria-invalid={!!errors.email} errorMessage={errors.email?.message} />
                        )}
                    />
                </div>
                <Button type='submit' color='primary' className='w-full' isLoading={updateLoading}>Guardar</Button>
            </Form>
        </div>
    );
}