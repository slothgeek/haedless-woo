'use client';

import { LuX, LuArrowRight } from "react-icons/lu"
import { useCart } from "@/hooks/useCart";
import { Button, Divider, Link, Spinner, Input } from "@heroui/react";
import Image from "next/image";
import QuantityInput from "@/components/ui/shop/quantityInput";
import Loading from "../loading";

export default function Cart() {

    const { cartData, cartLoading, getCheckoutUrl, handleUpdateCartItemQuantities, handleRemoveFromCart } = useCart();

    const handleCheckout = async () => {
        const checkoutUrl = await getCheckoutUrl();
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
    }

    const updateCartItemQuantity = async (key: string, quantity: number) => {
        await handleUpdateCartItemQuantities([{ key, quantity }]);
    }

    const removeFromCart = async (key: string) => {
        await handleRemoveFromCart(key);
    }

    if (cartLoading) {
        return <Loading className='h-[500px]' label='Cargando carrito...' />
    }

    if (cartData?.cart.isEmpty) {
        return <CartEmpty />
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-8/12">
                    <div className="p-4 rounded-lg space-y-6">
                        <h2 className="text-lg font-bold">Tus productos</h2>
                        <Divider />
                        <div className="space-y-6">
                            {
                                cartData?.cart.contents.nodes.map((node: any) => (
                                    <div key={node.key} className="flex items-center justify-between gap-6">
                                        <div className="w-4/7">
                                            <div className="flex items-center gap-6">
                                                <Image src={node.product.node.image.mediaItemUrl} alt={node.product.node.name} width={100} height={100} className="rounded-lg" />
                                                <div>
                                                    <h3 className="font-bold mb-1">{node.product.node.name}</h3>
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
                                        <div className="w-1/7 flex justify-center">
                                            <strong>{node.total}</strong>
                                        </div>
                                        <div className="w-1/7 flex justify-center">
                                            {
                                                node.product.node.soldIndividually ?
                                                    <div>
                                                        <span>{node.quantity}</span>
                                                    </div>
                                                    :
                                                    <QuantityInput value={node.quantity} isDisabled={false} onChange={(value) => updateCartItemQuantity(node.key, value)} />
                                            }
                                        </div>
                                        <div className="w-1/7 flex justify-end">
                                            <Button color='default' radius='md' size='lg' onPress={() => removeFromCart(node.key)} isIconOnly><LuX /></Button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-4/12">
                    <div className="sticky top-16 bg-gray-100 border border-gray-200 p-4 rounded-lg space-y-6 shadow-[0_0_20px_0_rgba(0,0,0,0.1)]">
                        <h2 className="text-lg font-bold">Resumen de la orden</h2>
                        <CouponForm />
                        <div className="flex justify-between">
                            <strong className=" text-gray-500">Envío</strong>
                            <p>{cartData?.cart.chosenShippingMethods}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong className=" text-gray-500">Impuestos</strong>
                            <p>{cartData?.cart.totalTax}</p>
                        </div>
                        <div className="flex justify-between">
                            <strong className=" text-gray-500">Subtotal</strong>
                            <p>{cartData?.cart.subtotal}</p>
                        </div>
                        <Divider />
                        <div className="flex justify-between">
                            <strong>Total</strong>
                            <p>{cartData?.cart.total}</p>
                        </div>
                        <Button color='primary' radius='full' fullWidth size='lg' onPress={handleCheckout} endContent={<LuArrowRight className="w-6 h-6" />}>Finalizar compra</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


const CartEmpty = () => {
    return <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h2 className="text-lg font-bold">Tu carrito está vacío</h2>
        <div className="text-gray-500">
            <p>Añade productos a tu carrito para continuar</p>
        </div>
        <Button color='default' radius='full' size='lg' as={Link} href="/shop" endContent={<LuArrowRight className="w-6 h-6" />}>Ir a la tienda</Button>
    </div>
}

const CouponForm = () => {
    return <div className="flex items-center">
        <Input placeholder="¿Tienes un código de descuento?" classNames={{ inputWrapper: 'bg-white rounded-r-none shadow-none' }} />
        <Button color='default' onPress={() => { }} className="rounded-l-none">Aplicar</Button>
    </div>
}