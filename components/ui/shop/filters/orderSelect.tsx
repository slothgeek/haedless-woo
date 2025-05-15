'use client'

import { Select, SelectItem } from '@heroui/react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { LuArrowDownAZ, LuArrowUpAZ, LuStamp, LuStar, LuArrowUp01, LuArrowDown01, LuCalendarPlus, LuListOrdered } from 'react-icons/lu';

const options = [
    { label: 'Nombre: A-Z', value: 'NAME-ASC', icon: <LuArrowUpAZ /> },
    { label: 'Nombre: Z-A', value: 'NAME-DESC', icon: <LuArrowDownAZ /> },
    { label: 'Populares', value: 'TOTAL_SALES-DESC', icon: <LuStamp /> },
    { label: 'Mejor calificados', value: 'RATING-DESC', icon: <LuStar /> },
    { label: 'Recientes', value: 'DATE-ASC', icon: <LuCalendarPlus /> },
    { label: 'Precio: Bajo a Alto', value: 'PRICE-ASC', icon: <LuArrowDown01 /> },
    { label: 'Precio: Alto a Bajo', value: 'PRICE-DESC', icon: <LuArrowUp01 /> },
]

export default function OrderSelect() {
    const [order, setOrder] = useState('');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    useEffect(() => {
        setOrder(searchParams.get('order') || '');
        if (searchParams.get('order_field') && searchParams.get('order')) {
            setOrder(`${searchParams.get('order_field')}-${searchParams.get('order')}`);
        }
    }, [searchParams]);

    const handleOrder = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (!value) {
            params.delete('order');
            params.delete('order_field');
        } else {
            const [field, order] = value.split('-');
            params.set('order', order);
            params.set('order_field', field);
        }

        replace(`${pathname}?${params.toString()}`);
        setOrder(value);
    }

    return (
        <div>
            <Select     
            className='w-[200px]' 
            placeholder='Ordenar por' 
            aria-label='Ordenar por'
            selectedKeys={[order]}
            onChange={(e) => handleOrder(e.target.value)}
            startContent={<LuListOrdered className='text-gray-500' />}    
            >
                {options.map((option) => (
                    <SelectItem key={option.value} startContent={option.icon}>{option.label}</SelectItem>
                ))}
            </Select>
        </div>
    )
}