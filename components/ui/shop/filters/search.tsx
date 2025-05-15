'use client'

import { Input } from "@heroui/react"
import { LuSearch } from "react-icons/lu"
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div>
            <Input
                label={<h3 className="text-lg font-bold">Buscar producto</h3>}
                labelPlacement="outside"
                placeholder="Buscar por nombre, categoria, etc."
                classNames={{
                    inputWrapper: "bg-white !hover:bg-white !focus:bg-white"
                }}
                startContent={<LuSearch />}
                defaultValue={searchParams.get('search')?.toString() || ''}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    )
}