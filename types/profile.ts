import { z } from "zod";

export const profileFormSchema = z.object({
    firstName: z.string().min(1, { message: 'El nombre es requerido' }),
    lastName: z.string().min(1, { message: 'El apellido es requerido' }),
    email: z.string().email({ message: 'El email es requerido' }),
});


export type ProfileFormData = z.infer<typeof profileFormSchema>;