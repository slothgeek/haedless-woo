'use client'

import { Slider } from "@heroui/react"
import { useEffect, useState } from "react"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

export default function PriceFilter({ min, max }: { min: number, max: number }) {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [minPrice, setMinPrice] = useState(min);
    const [maxPrice, setMaxPrice] = useState(max);
    const steps = max / 10;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (() => {
            const params = new URLSearchParams(searchParams);
            if (params.get('min_price') && params.get('max_price')) {
                setMinPrice(Number(params.get('min_price')));
                setMaxPrice(Number(params.get('max_price')));
            }
            setLoading(false);
        })();
    }, []);

    const handlePrice = (value: number[]) => {
        const params = new URLSearchParams(searchParams);
        params.set('min_price', value[0].toString());
        params.set('max_price', value[1].toString());
        replace(`${pathname}?${params.toString()}`);
        setMinPrice(value[0]);
        setMaxPrice(value[1]);
    }

    const handleClear = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('min_price');
        params.delete('max_price');
        replace(`${pathname}?${params.toString()}`);
        setMinPrice(0);
        setMaxPrice(max);
    }

    return (
        <div>
            {!loading &&
                <>
                    <Slider
                        formatOptions={{ style: "currency", currency: CURRENCY }}
                        label={<h3 className="text-lg font-bold mb-4">Precio</h3>}
                        value={[minPrice, maxPrice]}
                        maxValue={max}
                        minValue={0}
                        step={steps}
                        size="sm"
                        className="w-full"
                        onChange={(value) => handlePrice(value as number[])}
                    />
                    <div className="flex justify-end cursor-pointer">
                        <button className="text-gray-500 text-sm" onClick={handleClear}>
                            Limpiar
                        </button>
                    </div>
                </>
            }
        </div>
    )
}