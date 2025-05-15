    import { countries } from './countries';

    export function orderStatus(status: string) {
        switch (status) {
            case 'PENDING':
                return 'Pendiente';
            case 'PROCESSING':
                return 'En proceso';
            case 'COMPLETED':
                return 'Completado';
            case 'CANCELLED':
                return 'Cancelado';
            case 'ON_HOLD':
                return 'En espera';
            case 'FAILED':
                return 'Fallado';
            case 'REFUNDED':
                return 'Reembolsado'
            default:
                return status;
        }
    }

    /**
     * Decodifica un valor codificado en URL
     * @param encodedValue Valor codificado en URL (ej: b3JkZXI6NzE%3D)
     * @returns Valor decodificado (ej: b3JkZXI6NzE=)
     */
    export function decodeUrlValue(encodedValue: string): string {
        return decodeURIComponent(encodedValue);
    }

    /**
     * Codifica un valor para URL
     * @param value Valor a codificar (ej: b3JkZXI6NzE=)
     * @returns Valor codificado para URL (ej: b3JkZXI6NzE%3D)
     */
    export function encodeUrlValue(value: string): string {
        return encodeURIComponent(value);
    }

    /**
     * Formatea un monto a formato de precio con la moneda especificada
     * @param amount Monto a formatear
     * @param currency Código de moneda (ej: USD, EUR, MXN)
     * @returns Monto formateado con el símbolo de la moneda
     */
    export function formatPrice(amount: string, currency: string, showCurrency: boolean = true): string {

        //remove simbols
        const cleanAmount = amount.replace(/[^\d.]/g, '');

        const numericAmount = typeof cleanAmount === 'string' ? parseFloat(cleanAmount) : cleanAmount;

        if (showCurrency) {
            return new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numericAmount);
        } else {
            return new Intl.NumberFormat('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numericAmount);
        }
    }

    /**
     * Obtiene el nombre de un país basado en su código ISO
     * @param countryCode Código ISO del país (ej: MX, US, ES)
     * @returns Nombre del país en español o el código si no se encuentra
     */
    export function getCountryName(countryCode: string): string {
        return countries[countryCode.toUpperCase()] || countryCode;
    }
