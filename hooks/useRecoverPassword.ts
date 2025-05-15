import { gql, useMutation } from '@apollo/client'

const RECOVER_PASSWORD = gql`
    mutation RecoverPassword($input: SendPasswordResetEmailInput!) {
        sendPasswordResetEmail(input: $input){
            success
        }
    }
`;

export function useRecoverPassword() {
    const [recoverPassword, { loading, error }] = useMutation(RECOVER_PASSWORD);

    const handleRecoverPassword = async (email: string) => {
        try {
            const result = await recoverPassword({ variables: { input: { username: email } } });

            if(result.data.sendPasswordResetEmail.success) {
                return {
                    success: true,
                    message: 'Si tu correo electrónico está registrado, recibirás un correo electrónico con un enlace para restablecer tu contraseña.'
                };
            }

            return {
                success: false,
                message: 'No se pudo enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.'
            };
        } catch (error) {
            console.error(error);
        }
    }

    return { handleRecoverPassword, loading, error };
}