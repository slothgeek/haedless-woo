import { z } from 'zod';

export const shippingAddressSchema = z.object({
    id: z.string().optional(),
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    address1: z.string().min(1, "La dirección es requerida"),
    address2: z.string().optional(),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "El estado/provincia es requerido"),
    postcode: z.string().min(1, "El código postal es requerido"),
    country: z.string().min(1, "El país es requerido"),
});
