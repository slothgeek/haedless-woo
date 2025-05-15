'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils/helpers'
import Link from 'next/link';
import Price from '@/components/ui/shop/price';
import AddToCart from '@/components/ui/shop/add-to-cart';
import SaleLabel from './saleLabel';
import ProductPopup from './product-popup';
export default function Product({ product }: { product: any }) {

    return (
        <div className='bg-gray-100 border border-gray-200 rounded-md'>
            <Link href={`/shop/product/${product.slug}`}>
                <div className='relative'>
                    <Image className='w-full' src={product.image?.mediaItemUrl || '/shop/product.png'} alt={product.name} width={300} height={300} />
                    {product.onSale && <SaleLabel />}
            </div>
            </Link>
            <div className='text-center p-4 space-y-3'>
                <Link href={`/shop/product/${product.slug}`}>
                    <h2 className='!text-lg font-bold'>{product.name}</h2>
                </Link>
                <Price price={product.price} />
                <div className='flex justify-center gap-2'>
                    <ProductPopup productId={product.databaseId} isIcon />
                    <AddToCart product={product} />
                </div>
            </div>
        </div>
    )
}
