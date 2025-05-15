import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { ShippingAddress, ShippingAddressFormData } from '@/types/shipping';
import { useToast } from '@/hooks/useToast';
import { Password, PasswordChangeFormData } from '@/types/password';

const UPDATE_PASSWORD = gql`
    mutation UpdatePassword($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            customer {
                email
            }
        }
    }
`;

const RESET_USER_PASSWORD = gql`
    mutation ResetUserPassword($input: ResetUserPasswordInput!) {
        resetUserPassword(input: $input) {
            user {
                email
            }
        }
    }
`;

const usePasswordChange = (customerId: number) => {
    const { showToast } = useToast();

    const [updatePassword, { loading: updateLoading }] = useMutation(UPDATE_PASSWORD, {
        onCompleted: () => {
            showToast({
                type: 'success',
                message: 'Contraseña actualizada correctamente',
            });
        },
        onError: (error) => {
            showToast({
                type: 'danger',
                message: `Error al actualizar la contraseña: ${error.message}`,
            });
        },
    });

    const [resetUserPassword, { loading: resetLoading }] = useMutation(RESET_USER_PASSWORD, {
        onCompleted: () => {
            showToast({
                type: 'success',
                message: 'Contraseña restablecida correctamente',
            });
        },
        onError: (error) => {
            showToast({
                type: 'danger',
                message: `Error al restablecer la contraseña: ${error.message}`,
            });
        },
    });

    const handleSubmit = async (formData: PasswordChangeFormData) => {
        try {

            if (formData.newPassword !== formData.confirmPassword) {
                showToast({
                    type: 'danger',
                    message: 'Las contraseñas no coinciden',
                });
                return false;
            }

            await updatePassword({
                variables: {
                    input: {
                        id: customerId,
                        password: formData.newPassword,
                    },
                },
            });

            return true;
        } catch (error) {
            console.error('Error al actualizar la contraseña:', error);
        }
    };

    const handleResetPassordWithKey = async (key: string, login: string, password: string) => {
        try {
            const result = await resetUserPassword({
                variables: {
                    input: { key, login, password },
                },
            });

            showToast({
                type: 'success',
                message: 'Contraseña restablecida correctamente',
            });

            return result;
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
        }
    }

    return {
        updateLoading,
        resetLoading,
        handleSubmit,
        handleResetPassordWithKey,
    };
};

export default usePasswordChange;