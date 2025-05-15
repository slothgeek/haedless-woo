'use client'

import { formatPrice } from '@/lib/utils/helpers'
import { useEffect, useState } from 'react'
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY as string;

export default function Price({ price, regularPrice, salePrice, className }: { price: string, regularPrice?: string, salePrice?: string, className?: string }) {

    const [formattedPrice, setFormattedPrice] = useState<string>();

    useEffect(() => {
        // if price is a number, format it
        const prices = price.split(',');

        if (prices.length === 1) {

            if(prices[0].includes('-')) {
                const [minPrice, maxPrice] = prices[0].split('-');
                setFormattedPrice(formatPrice(minPrice, CURRENCY) + ' - ' + formatPrice(maxPrice, CURRENCY, false));
            } else {
                setFormattedPrice(formatPrice(prices[0], CURRENCY));
            }
        } else {
            const minPrice = prices[0];
            const maxPrice = prices[prices.length - 1];
            setFormattedPrice(formatPrice(minPrice, CURRENCY) + ' - ' + formatPrice(maxPrice, CURRENCY, false));
        }
    }, [price])

    return (
        <div>
            <p className={className}>{formattedPrice}</p>
        </div>
    )
}