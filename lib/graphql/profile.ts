
import { gql, useQuery, useMutation } from '@apollo/client';
import { shippingAddressSchema } from '@/lib/utils/schemas';

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

export async function updateShippingAddressAction(prevState: any, formData: FormData) {
    try {
        const validatedFields = shippingAddressSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            return { error: 'Datos inválidos: ' + validatedFields.error.errors.map(e => e.message).join(', ') };
        }

        const {id, ...shipping} = validatedFields.data;

        if (!id) {
            return { error: 'No se encontró el ID del cliente' };
        }


        if (!response?.data?.updateCustomer?.customer) {
            return { error: 'Error al actualizar la dirección de envío' };
        }

        return { success: 'Dirección de envío actualizada correctamente' };
    } catch (error: any) {
        console.error('Error en updateShippingAddressAction:', error);
        return { error: 'Error inesperado: ' + error.message };
    }
}