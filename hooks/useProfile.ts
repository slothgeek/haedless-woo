import { gql, useQuery, useMutation } from '@apollo/client';
import { useToast } from '@/hooks/useToast';

const GET_USER_PROFILE = gql`
    query GetUserProfile($customerId: Int!) {
        customer(customerId: $customerId) {
            id
            firstName
            lastName
            email
        }
    }
`;


const UPDATE_USER_PROFILE = gql`
    mutation UpdateUserProfile($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            customer {
                id
                firstName
                lastName
                email
            }
        }
    }
`;

export const useProfile = ( customerId: number ) => {
    const { data, loading, error } = useQuery(GET_USER_PROFILE, {
        variables: { customerId },
        skip: !customerId,
    });

    const { showToast } = useToast();

    const [updateUserProfile, { loading: updateLoading }] = useMutation(UPDATE_USER_PROFILE, {
        onCompleted: () => {
            showToast({
                type: 'success',
                message: 'Perfil actualizado correctamente',
            });
        },
        onError: (error) => {
            showToast({
                type: 'danger',
                message: `Error al actualizar el perfil: ${error.message}`,
            });
        },
    });

    const handleSubmit = async (data: any) => {
        try {
            await updateUserProfile({
                variables: { input: data },
            });
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    }

    return { profileData: data?.customer, loading, error, handleSubmit, updateLoading };
};