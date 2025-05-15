'use client'

import { gql, useQuery } from '@apollo/client';
import { useSearchParams } from 'next/navigation'
import Product from '../../ui/shop/product';
import { useState, useEffect } from 'react';
import OrderSelect from '../../ui/shop/filters/orderSelect';
import { Button } from '@heroui/react'
import { LuPlus } from 'react-icons/lu';

const GET_PRODUCTS = gql`
    query get_products($cursor: String = "", $search: String = "", $maxPrice: Float = 10000000, $minPrice: Float = 0, $field: ProductsOrderByEnum = DATE, $order: OrderEnum = ASC, $category: String = "") {
        products(
            first: 8,
            after: $cursor
            where: {visibility: CATALOG, status: "publish", stockStatus: IN_STOCK, search: $search, maxPrice: $maxPrice, minPrice: $minPrice, orderby: {field: $field, order: $order}, category: $category}
        ) {
            edges {
                cursor
                node {
                    databaseId
                    id
                    ... on SimpleProduct {
                        id
                        name
                        image {
                            mediaItemUrl
                        }
                        price(format: RAW)
                        onSale
                        shortDescription(format: RAW)
                        slug
                        title(format: RAW)
                        salePrice
                    }
                    ... on VariableProduct {
                        id
                        name
                        image {
                            mediaItemUrl
                        }
                        onSale
                        price(format: RAW)
                        salePrice(format: RAW)
                        sku
                        slug
                        title(format: RAW)
                    }
                    ... on ExternalProduct {
                        id
                        name
                        image {
                            mediaItemUrl
                        }
                        onSale
                        price(format: RAW)
                        salePrice(format: RAW)
                        sku
                        slug
                        title(format: RAW)
                    }
                    ... on GroupProduct {
                        id
                        name
                        image {
                            mediaItemUrl
                        }
                        onSale
                        price(format: RAW)
                        salePrice(format: RAW)
                        sku
                        slug
                        title(format: RAW)
                    }
                }
            }
            found
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`
export default function ShopMain({category}: {category?: string}) {
    const searchParams = useSearchParams();

    const [cursor, setCursor] = useState('');
    const [products, setProducts] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [search, setSearch] = useState('');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [totalProducts, setTotalProducts] = useState(0);
    const [orderField, setOrderField] = useState('NAME');
    const [order, setOrder] = useState('ASC');

    const { data, loading } = useQuery(GET_PRODUCTS, {
        variables: {
            cursor: cursor,
            search: search,
            minPrice: minPrice,
            maxPrice: maxPrice,
            field: orderField,
            order: order,
            category: category
        },
        skip: isLoadingMore && cursor === ''
    });
    
    useEffect(() => {
        if (data?.products.edges) {
            if (cursor === '') {
                setProducts(data.products.edges);
            } else {
                setProducts(prevProducts => [...prevProducts, ...data.products.edges]);
            }
            setTotalProducts(data.products.found);
            setHasMore(data.products.pageInfo.hasNextPage);
            setIsLoadingMore(false);
        }
    }, [data, cursor]);

    const handleLoadMore = async () => {
        if (data?.products.edges.length) {
            setIsLoadingMore(true);
            setCursor(data.products.pageInfo.endCursor);
        }
    }

    useEffect(() => {
        setMinPrice(Number(searchParams.get('min_price')) || 0);
        setMaxPrice(Number(searchParams.get('max_price')) || 10000000);
        setSearch(searchParams.get('search') || '');
        setOrderField(searchParams.get('order_field') || 'NAME');
        setOrder(searchParams.get('order') || 'ASC');
        setCursor('');
    }, [searchParams]);

    if (loading && !isLoadingMore) {
        return <div>Loading...</div>
    }

    return (
        <main>
            <header>
                <div className='flex justify-between items-center p-4'>
                    <div>
                        Total encontrados: {totalProducts}
                    </div>
                    <div>
                        <OrderSelect />
                    </div>
                </div>
            </header>
            <div className='grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-3 xl:grid-cols-4 p-4'>
                {products?.map((product: any) => (
                    <Product key={product.node.databaseId} product={product.node} />
                ))}
            </div>

            <div className='flex justify-center items-center p-4'>
                {hasMore && (
                    <Button
                        onPress={handleLoadMore}
                        isLoading={isLoadingMore}
                        variant='bordered'
                        color='default'
                        className='font-bold'
                        radius='full'
                        endContent={<LuPlus className='w-5 h-5' />}
                    >
                        {isLoadingMore ? 'Cargando...' : 'Cargar más'}
                    </Button>
                )}
            </div>
        </main>
    )
}