
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuLayoutGrid } from "react-icons/lu"

export default function CategoryFilter({ data }: { data: any }) {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (data) {
            setCategories(data.filter((category: { slug: string }) => category.slug !== 'uncategorized'));
        }
    }, [data]);

    return (
        <div>
                <h3 className="text-lg font-bold mb-4">Categorías</h3>
                <ul className='flex flex-col gap-2'>
                    <li>
                        <Link href='/shop' className='flex items-center gap-2 hover:underline hover:text-primary cursor-pointer' onClick={() => handleCategory('')}>
                            <div className="w-8 h-8 bg-gray-200 rounded-sm flex items-center justify-center">
                                <LuLayoutGrid className='w-5 h-5' />
                            </div>
                            <span>Todas</span>
                        </Link>
                    </li>
                    {categories && categories?.map((category: { id: string, name: string, slug: string, count: number, image: { mediaItemUrl: string } }) => (
                        <li key={category.id}>
                            <Link href={`/shop/${category.slug}`} className='flex items-center gap-2 hover:underline hover:text-primary cursor-pointer' onClick={() => handleCategory(category.slug)}>
                                {
                                    category.image ? (
                                        <img src={category.image.mediaItemUrl} alt={category.name} className='w-8 h-8 rounded-sm' />
                                    ) : (
                                        <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
                                    )
                                }
                                <span>{category.name} ({category.count || 0})</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
    )
}