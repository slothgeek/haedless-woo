import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { ShippingAddress, ShippingAddressFormData } from '@/types/shipping';
import { useToast } from '@/hooks/useToast';

const GET_SHIPPING_ADDRESS = gql`
    query GetShippingAddress($customerId: Int!) {
        customer(customerId: $customerId) {
            shipping {
                address1
                address2
                city
                company
                country
                email
                firstName
                lastName
                phone
                postcode
                state
            }
        }
    }
`;

const UPDATE_SHIPPING_ADDRESS = gql`
    mutation UpdateShippingAddress($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            customer {
                shipping {
                    firstName
                    lastName
                    address1
                    address2
                    city
                    country
                    postcode
                    state
                    phone
                }
            }
        }
    }
`;

// Función para sanitizar los datos y convertir null a string vacía
const sanitizeShippingData = (data: any): ShippingAddress => {
    if (!data) return {
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        country: '',
        postcode: '',
        state: '',
    };

    return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        country: data.country || '',
        postcode: data.postcode || '',
        state: data.state || '',
        phone: data.phone || '',
    };
};

export const useShippingAddress = (customerId: number) => {
    const [country, setCountry] = useState('');
    const { showToast } = useToast();

    const { data, loading, error, refetch } = useQuery(GET_SHIPPING_ADDRESS, {
        variables: { customerId },
        skip: !customerId,
    });

    // Actualizar el país cuando se cargan los datos
    useEffect(() => {
        if (data?.customer?.shipping?.country) {
            setCountry(data.customer.shipping.country);
        }
    }, [data?.customer?.shipping?.country]);

    const [updateShippingAddress, { loading: updateLoading }] = useMutation(UPDATE_SHIPPING_ADDRESS, {
        onCompleted: () => {
            showToast({
                type: 'success',
                message: 'Dirección actualizada correctamente',
            });
            refetch();
        },
        onError: (error) => {
            showToast({
                type: 'danger',
                message: `Error al actualizar la dirección: ${error.message}`,
            });
        },
    });

    const handleSubmit = async (formData: ShippingAddressFormData) => {
        try {
            await updateShippingAddress({
                variables: {
                    input: {
                        id: customerId,
                        shipping: formData,
                    },
                },
            });
        } catch (error) {
            console.error('Error al actualizar la dirección:', error);
        }
    };

    return {
        shippingData: data?.customer?.shipping ? sanitizeShippingData(data.customer.shipping) : undefined,
        loading,
        error,
        updateLoading,
        country,
        setCountry,
        handleSubmit,
    };
}; 