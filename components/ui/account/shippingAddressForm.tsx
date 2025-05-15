'use client';
import { useContext, useEffect } from 'react';
import { Form, Button, Input } from '@heroui/react';
import { AccountContext } from '@/providers';
import { CountriesSelect, StatesSelect } from '@/components/ui/CustomInputs';
import { useShippingAddress } from '@/hooks/useShippingAddress';
import { shippingAddressSchema, shippingAddressEditSchema } from '@/types/shipping';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

export default function ShippingAddressForm() {
    const { userData } = useContext(AccountContext);
    const {
        shippingData,
        loading,
        error,
        updateLoading,
        country,
        setCountry,
        handleSubmit,
    } = useShippingAddress(userData?.databaseId);

    const {
        control,
        handleSubmit: handleFormSubmit,
        formState: { errors },
        reset,
        setValue,
        trigger
    } = useForm({
        resolver: zodResolver(shippingAddressEditSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            country: '',
            postcode: '',
            state: '',
        }
    });

    // Actualizar los valores del formulario cuando se cargan los datos
    useEffect(() => {
        if (shippingData) {
            Object.entries(shippingData).forEach(([key, value]) => {
                setValue(key as any, value);
            });
        }
    }, [shippingData]);

    const onSubmit = async (data: any) => {
        // Validar con el esquema completo antes de enviar
        const result = shippingAddressSchema.safeParse(data);
        if (!result.success) {
            // Si la validación falla, mostrar los errores
            const errors = result.error.errors;
            errors.forEach(error => {
                const field = error.path[0];
                setValue(field as any, data[field], { shouldValidate: true });
            });
            return;
        }
        // Si la validación es exitosa, proceder con el envío
        await handleSubmit(result.data);
    };

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

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Dirección de envío</h2>

            <Form onSubmit={handleFormSubmit(onSubmit)} className="w-full space-y-4">
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
                                />
                            )}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
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
                                />
                            )}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <Controller
                    name="country"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <CountriesSelect
                            {...field}
                            value={value || ''}
                            onChange={onChange}
                            allowedCountries={true}
                            onSelectionChange={(newValue) => {
                                onChange(newValue);
                                setCountry(newValue);
                            }}
                            error={errors.country?.message}
                        />
                    )}
                />

                <div className="space-y-2 w-full">
                    <h3 className="text-lg font-medium">Dirección</h3>
                    <Controller
                        name="address1"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Input
                                {...field}
                                value={value || ''}
                                onChange={onChange}
                                label="Dirección"
                                aria-invalid={!!errors.address1}
                            />
                        )}
                    />
                    {errors.address1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>
                    )}

                    <Controller
                        name="address2"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Input
                                {...field}
                                value={value || ''}
                                onChange={onChange}
                                label="Apartamento, suite, etc."
                                aria-invalid={!!errors.address2}
                            />
                        )}
                    />
                    {errors.address2 && (
                        <p className="mt-1 text-sm text-red-600">{errors.address2.message}</p>
                    )}
                </div>

                <Controller
                    name="state"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                        <StatesSelect
                            {...field}
                            value={value || ''}
                            onChange={onChange}
                            country={country}
                            error={errors.state?.message}
                        />
                    )}
                />

                <div className="space-y-2 w-full">
                    <Controller
                        name="city"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Input
                                {...field}
                                value={value || ''}
                                onChange={onChange}
                                label="Ciudad"
                                aria-invalid={!!errors.city}
                            />
                        )}
                    />
                    {errors.city && (
                        <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                </div>

                <div className="space-y-2 w-full">
                    <Controller
                        name="postcode"
                        control={control}
                        render={({ field: { onChange, value, ...field } }) => (
                            <Input
                                {...field}
                                value={value || ''}
                                onChange={onChange}
                                label="Código postal"
                                aria-invalid={!!errors.postcode}
                            />
                        )}
                    />
                    {errors.postcode && (
                        <p className="mt-1 text-sm text-red-600">{errors.postcode.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    color="primary"
                    className="mt-4 w-full"
                    disabled={updateLoading}
                    isLoading={updateLoading}
                >
                    Guardar
                </Button>
            </Form>
        </div>
    );
}
