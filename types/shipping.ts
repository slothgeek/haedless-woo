import { z } from 'zod';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  country: string;
  postcode: string;
  state: string;
  phone?: string;
}

// Esquema base para validación durante la edición
const baseSchema = {
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  address1: z.string().nullable().optional(),
  address2: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postcode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
};

// Esquema para validación al enviar
export const shippingAddressSchema = z.object({
  firstName: z.string().min(2, 'El nombre es requerido'),
  lastName: z.string().min(2, 'El apellido es requerido'),
  address1: z.string().min(5, 'La dirección es requerida'),
  address2: z.string().nullable().optional().transform(val => val || ''),
  city: z.string().min(2, 'La ciudad es requerida'),
  postcode: z.string().min(4, 'El código postal es requerido'),
  country: z.string().min(2, 'El país es requerido'),
  state: z.string().min(2, 'El estado es requerido'),
  phone: z.string().nullable().optional().transform(val => val || ''),
});

// Esquema para validación durante la edición
export const shippingAddressEditSchema = z.object(baseSchema);

export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>; 