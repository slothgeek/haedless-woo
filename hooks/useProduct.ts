'use client'

import client from '@/lib/graphql/apollo-client';
import { gql, useQuery } from '@apollo/client';

const GET_PRODUCT = gql`
    query GetProduct($id: ID = "", $idType: ProductIdTypeEnum = SLUG) {
        product(id: $id, idType: $idType) {
            id
            databaseId
            name
            shortDescription(format: RENDERED)
            description(format: RENDERED)
            sku
            slug
            reviewCount
            image {
                mediaItemUrl
            }
            galleryImages {
                nodes {
                    mediaItemUrl
                    description
                }
            }
            terms {
                nodes {
                    name
                    slug
                    id
                }
            }
            attributes {
                nodes {
                    id
                    label
                    variation
                    options
                    visible
                    name
                    attributeId
                }
            }
            ... on SimpleProduct {
                onSale
                price(format: RAW)
                salePrice(format: RAW)
                purchaseNote
                regularPrice(format: RAW)
                soldIndividually
                stockQuantity
                stockStatus
            }
            ... on VariableProduct {
                onSale
                price(format: RAW)
                salePrice(format: RAW)
                purchaseNote
                regularPrice(format: RAW)
                soldIndividually
                stockQuantity
                stockStatus
                variations {
                    nodes {
                        id
                        databaseId
                        hasAttributes
                        image {
                            mediaItemUrl
                        }
                        onSale
                        name
                        price(format: RAW)
                        regularPrice(format: RAW)
                        reviewCount
                        salePrice(format: RAW)
                        sku
                        slug
                        soldIndividually
                        stockQuantity
                        stockStatus
                        shortDescription(format: RENDERED)
                    }
                }
            }
        }
}
`

export default function useProduct(id?: string | number, idType?: string) {
    const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { id, idType }, skip: !id || !idType });

    const fetchProduct = async (id: string | number, idType: string) => {
        const { data } = await client.query({ query: GET_PRODUCT, variables: { id, idType } });
        return data?.product;
    }

    return { product: data?.product, loading, error, fetchProduct };
}