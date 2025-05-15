'use client'

import { gql, useQuery } from '@apollo/client';
import CategoryFilter from '../../ui/shop/filters/category';
import SearchFilter from '../../ui/shop/filters/search';
import PriceFilter from '../../ui/shop/filters/price';

const GET_FILTERS_DATA = gql`
    query GetFiltersData {
        productCategories(first: 100) {
            nodes {
                count
                name
                parentId
                slug
                databaseId
                id
                image {
                    mediaItemUrl
                }
            }
        }
        products(first: 1, where: {orderby: {field: PRICE, order: DESC}}) {
            nodes {
            ... on SimpleProduct {
                price(format: RAW)
            }
            ... on SimpleProductVariation {
                price(format: RAW)
            }
            ... on VariableProduct {
                price(format: RAW)
            }
            }
        }
    }
`;

export default function ShopAside() {
    const { data, loading } = useQuery(GET_FILTERS_DATA);   

    if (loading && !data) return <div>Cargando...</div>;

    return (
        <aside className="relative space-y-6 hidden lg:block flex flex-col gap-10 p-4 bg-gray-100 border border-gray-200 rounded-lg mb-12">
            <h2 className='mb-12'>Filtros</h2>
            <SearchFilter />
            <PriceFilter min={0} max={data.products.nodes[0].price as number} />
            <CategoryFilter data={data.productCategories.nodes} />
        </aside>
    )
}