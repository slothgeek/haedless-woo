
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart';

export default function AddToCart({ product }: { product: any }) {
    const router = useRouter();

    const productType = product.__typename as string;

    const { handleAddToCart, loadingAddToCart } = useCart();

    const addToCart = async (productId: number) => {
        await handleAddToCart(productId, 0, 1);
    }

    return (
        <>
            {
                productType == 'SimpleProduct' ?
                <AddToCartSimpleProduct product={product} onPress={addToCart} isLoading={loadingAddToCart} />
                :
                <AddToCartVariableProduct product={product} onPress={addToCart} />
            }
        </>
    )
}

function AddToCartSimpleProduct({ product, onPress, isLoading }: { product: any, onPress: (productId: number) => void, isLoading?: boolean }) {

    return (
        <Button radius='full' color='primary' className='font-bold' onPress={() => onPress(product.databaseId)} isLoading={isLoading}>
            Agregar al carrito
        </Button>
    )
}

function AddToCartVariableProduct({ product, onPress, isLoading }: { product: any, onPress: (productId: number) => void, isLoading?: boolean }) {
    return (
        <Button radius='full' color='primary' className='font-bold' variant='bordered' as={Link} href={`/shop/product/${product.slug}`}>
            Ver opciones
        </Button>
    )
}