import Image from 'next/image';
import Link from 'next/link';
import Price from '@/components/ui/shop/price';
import { Button, RadioGroup, Radio } from '@heroui/react';
import { useState, useEffect } from 'react';
import SaleLabel from '@/components/ui/shop/saleLabel';
import { useCart } from '@/hooks/useCart';
import QuantityInput from '@/components/ui/shop/quantityInput';

export default function ProductResume({ product, classNames }: { product: any, classNames?: { container?: string} }) {

    return (
        <div className={classNames?.container || 'bg-gray-100 py-16 px-4'}>
            <div className="max-w-[1100px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="col-span-1">
                        <div className='relative'>
                            <SaleLabel />
                            <Image src={product.image.mediaItemUrl || '/shop/product.png'} className='w-full' alt={product.name} width={500} height={500} />
                        </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                        <div className='flex flex-wrap gap-2'>
                            {
                                product.terms.nodes.map((term: any) => (
                                    <Link href={`/shop/category/${term.slug}`} key={term.id} className='uppercase text-sm text-gray-500'>
                                        {term.name}
                                    </Link>
                                ))
                            }
                        </div>
                        <h1 className="!text-5xl font-bold">{product.name}</h1>
                        <div>
                            {
                                product.onSale ? (
                                    <Price price={product.price} className='text-2xl' />
                                ) : (
                                    <Price price={product.price} className='text-2xl' />
                                )
                            }
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: product.shortDescription }}></div>
                        <AddToCart product={product} />
                        <div className='text-sm text-gray-500'>
                            <div>
                                <strong>SKU:</strong> {product.sku}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function AddToCart({ product }: { product: any }) {

    const variations = product.variations?.nodes;
    const isVariableProduct = product.__typename as string === 'VariableProduct';
    const [disabledAddToCart, setDisabledAddToCart] = useState(isVariableProduct ? true : false);
    const [inStock, setInStock] = useState(product.stockStatus == 'IN_STOCK');
    const [stockLimit, setStockLimit] = useState<number | null>(product.stockQuantity);
    const [variationKey, setVariationKey] = useState(product.attributes?.nodes.filter((attribute: any) => attribute.variation).map(() => ''));
    const [productSelected, setProductSelected] = useState(isVariableProduct ? undefined : product.databaseId);
    const [quantity, setQuantity] = useState(1);
    const { handleAddToCart, loadingAddToCart, getCheckoutUrl } = useCart();

    const handleQuantity = (value: number) => {
        if (!value) {
            return;
        }

        if (value < 1) {
            setQuantity(1);
        } else if (stockLimit == null || value <= stockLimit) {
            setQuantity(value);
        }
    }

    const handleChangeVariation = (value: string, index: number) => {
        setVariationKey((prev: any) => {
            const newVariationKey = [...prev];
            newVariationKey[index] = value;
            return newVariationKey;
        });
    }


    useEffect(() => {

        if (isVariableProduct) {
            const variationSlug = product.slug + '-' + variationKey.join('-').toLowerCase();

            const variation = variations.find((variation: any) => variation.slug == variationSlug);

            if (variation && variation.stockStatus == 'IN_STOCK') {
                setProductSelected(variation.databaseId);
                setDisabledAddToCart(false);
                setStockLimit(variation.stockQuantity);
                setQuantity(1);
            } else {
                setProductSelected(product.databaseId);
                setDisabledAddToCart(true);
                setStockLimit(product.stockQuantity);
                setQuantity(1);
            }
        }
    }, [variationKey]);

    const addToCart = async () => {
        if (isVariableProduct) {
            await handleAddToCart(product.databaseId, productSelected, quantity);
        } else {
            await handleAddToCart(product.databaseId, 0, quantity);
        }

        const checkoutUrl = await getCheckoutUrl();
    }

    if (!inStock) {
        return
    }

    return (
        <>
            {
                isVariableProduct &&
                <div className='space-y-4 mb-8'>
                    {
                        product.attributes.nodes.map((attribute: any, index: number) => (
                            <RadioGroup key={index} label={attribute.label} orientation="horizontal" className='space-x-4' onValueChange={(value) => handleChangeVariation(value, index)}>
                                {attribute.options.map((option: any, index: number) => (
                                    <Radio key={index} value={option} classNames={{ base: 'border-gray-300 border-1 rounded-full mr-2 translate-x-2' }}>{option}</Radio>
                                ))}
                            </RadioGroup>
                        ))
                    }
                </div>
            }
            <div className='flex items-center gap-2'>
                {
                    !product.soldIndividually &&
                    <QuantityInput value={quantity} isDisabled={disabledAddToCart} onChange={(value) => handleQuantity(value)} />
                }
                <Button color='primary' radius='full' size='lg' onPress={addToCart} isDisabled={disabledAddToCart}>Agregar al carrito</Button>
            </div>
            {
                stockLimit &&
                <div className='text-sm text-gray-500'>
                    <strong>Disponibles:</strong> {stockLimit}
                </div>
            }
        </>

    )
}