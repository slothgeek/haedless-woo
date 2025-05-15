import { z } from 'zod';

export interface Password {
    newPassword: string;
    confirmPassword: string;
}


export const passwordChangeSchema = z.object({
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(8, 'La confirmación de contraseña debe tener al menos 8 caracteres'),
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;