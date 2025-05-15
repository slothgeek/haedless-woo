'use client'

import { useCart } from '@/hooks/useCart';
import { LuShoppingCart } from 'react-icons/lu';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
    Divider
} from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { LuArrowRight, LuX} from 'react-icons/lu';
import Image from "next/image";
import QuantityInput from "@/components/ui/shop/quantityInput";

export default function MiniCart({cartRedirect = true}: {cartRedirect?: boolean}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { cartData, getCheckoutUrl, handleUpdateCartItemQuantities, handleRemoveFromCart } = useCart();
    const [checkoutUrl, setCheckoutUrl] = useState('');

    useEffect(() => {
        getCheckoutUrl().then(setCheckoutUrl);
    }, []);

    const updateCartItemQuantity = async (key: string, quantity: number) => {
        await handleUpdateCartItemQuantities([{ key, quantity }]);
    }

    const removeFromCart = async (key: string) => {
        await handleRemoveFromCart(key);
    }

    return (
        <>
            <Button isIconOnly onPress={onOpen} variant='light'>
                <LuShoppingCart className='w-6 h-6' />
            </Button>
            <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>

                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-3">Carrito de compras</DrawerHeader>
                            <DrawerBody className='space-y-4'>
                                {
                                    cartData?.cart.contents.nodes.map((node: any) => (
                                        <div key={node.key} className="flex items-center justify-between gap-2">
                                            <div className="flex justify-end">
                                                <Button color='danger' variant='light' radius='md' size='sm' onPress={() => removeFromCart(node.key)} isIconOnly><LuX /></Button>
                                            </div>
                                            <div className="w-full">
                                                <div className="flex items-center gap-2">
                                                    <Image src={node.product.node.image.mediaItemUrl} alt={node.product.node.name} width={42} height={42} className="rounded-lg" />
                                                    <div>
                                                        <div className='flex items-center gap-2  mb-1'>
                                                            <h3 className="font-bold">{node.product.node.name}</h3>
                                                            <span className='text-gray-500 text-sm'>x{node.quantity}</span>
                                                        </div>
                                                        {
                                                            node.variation && (
                                                                <div className="text-gray-500 flex flex-col text-sm">
                                                                    {
                                                                        node.variation.node.attributes.nodes.map((attribute: any) => (
                                                                            <div key={attribute.name}><strong>{attribute.label}</strong>: {attribute.value}</div>
                                                                        ))
                                                                    }
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>


                                            </div>
                                            <div className="flex justify-center">
                                                <strong>{node.total}</strong>
                                            </div>
                                        </div>
                                    ))
                                }
                            </DrawerBody>
                            <DrawerFooter className='flex flex-col gap-2'>
                                {
                                    cartRedirect && (
                                        <Button variant="bordered" as={Link} href='/cart' size='lg'>
                                            Carrito
                                        </Button>
                                    )
                                }
                                <Button color="primary" as={Link} href={checkoutUrl} size='lg'>
                                    Finalizar compra <span>{cartData?.cart.total}</span>
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    )
}