import { formatPrice } from '@/lib/utils/helpers';

export default function Amount({mount, currency}: {mount: string, currency: string}){
    return (
        <span>
            {formatPrice(mount, currency)}
        </span>
    )
}