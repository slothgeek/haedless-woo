'use client';

import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useToast } from '@/hooks/useToast';
import { HmacMD5 } from 'crypto-js';
import { useState } from 'react';
const ADD_TO_CART = gql`
    mutation AddToCart($input: AddToCartInput!) {
        addToCart(input: $input) {
            cartItem {
                key
                product {
                    node {
                        id
                        name
                    }
                }
                variation {
                    node {
                        id
                        name
                    }
                }
                quantity
            }
        }
    }
`;

const CHECKOUT_URL = gql`
    mutation UpdateSession($input: UpdateSessionInput!) {
        updateSession(input: $input) {
            customer {
                checkoutUrl
            }
        }
    }
`;

const GET_CART = gql`
    query GetCart {
        cart {
            contents {
                nodes {
                    key
                    quantity
                    total
                    subtotal
                    product {
                        node {
                            id
                            name
                            image {
                                mediaItemUrl
                            }
                            ... on SimpleProduct {
                                id
                                name
                                soldIndividually
                            }
                            ... on VariableProduct {
                                id
                                name
                                soldIndividually
                            }
                        }
                    }
                    variation {
                        node {
                            sku
                            attributes {
                            nodes {
                                label
                                name
                                value
                            }
                            }
                        }
                    }
                }
                itemCount
            }
            total
            subtotal
            totalTax
            discountTotal
            needsShippingAddress
            chosenShippingMethods
            isEmpty
            appliedCoupons {
                code
                description
            }
        }
    }
`;

const UPDATE_CARTITEM_QUANTITY = gql`
    mutation UpdateCartItemQuantities($items: [CartItemQuantityInput]) {
        updateItemQuantities(input: {items: $items}) {
            cart {
                contents {
                    nodes {
                        key
                        quantity
                        total
                        subtotal
                        product {
                            node {
                                id
                                name
                                image {
                                    mediaItemUrl
                                }
                                ... on SimpleProduct {
                                    id
                                    name
                                    soldIndividually
                                }
                                ... on VariableProduct {
                                    id
                                    name
                                    soldIndividually
                                }
                            }
                        }
                        variation {
                            node {
                                sku
                                attributes {
                                nodes {
                                    label
                                    name
                                    value
                                }
                                }
                            }
                        }
                    }
                    itemCount
                }
                total
                subtotal
                totalTax
                discountTotal
                needsShippingAddress
                chosenShippingMethods
                isEmpty
                appliedCoupons {
                    code
                    description
                }
            }
        }
    }
`;

const REMOVE_FROM_CART = gql`
mutation RemoveItemsFromCart($keys: [ID], $all: Boolean) {
  removeItemsFromCart(input: {keys: $keys, all: $all}) {
    cart {
                contents {
                    nodes {
                        key
                        quantity
                        total
                        subtotal
                        product {
                            node {
                                id
                                name
                                image {
                                    mediaItemUrl
                                }
                                ... on SimpleProduct {
                                    id
                                    name
                                    soldIndividually
                                }
                                ... on VariableProduct {
                                    id
                                    name
                                    soldIndividually
                                }
                            }
                        }
                        variation {
                            node {
                                sku
                                attributes {
                                nodes {
                                    label
                                    name
                                    value
                                }
                                }
                            }
                        }
                    }
                    itemCount
                }
                total
                subtotal
                totalTax
                discountTotal
                needsShippingAddress
                chosenShippingMethods
                isEmpty
                appliedCoupons {
                    code
                    description
                }
            }
    }
}
`;


export const useCart = () => {
    const { showToast } = useToast();
    const [cartData, setCartData] = useState<any>(null);

    const [updateSession, { loading: loadingUpdateSession }] = useMutation(CHECKOUT_URL, {
        onCompleted: (data) => {
            console.log('Respuesta exitosa:', data);
        },
        onError: (error) => {
            console.error('Error al obtener la URL de checkout:', error);
        },
    });
    
    const [addToCart, { loading: loadingAddToCart, error: errorAddToCart }] = useMutation(ADD_TO_CART, {
        onCompleted: (data) => {
            console.log('Respuesta exitosa:', data);
            showToast({
                type: 'success',
                message: 'Producto agregado al carrito',
            });
        },  
        onError: (error) => {
            console.error('Error detallado:', {
                message: error.message,
                networkError: error.networkError,
                graphQLErrors: error.graphQLErrors
            });
            showToast({
                type: 'danger',
                message: 'Error al agregar al carrito',
            });
        },
    });

    const [updateCartItemQuantities, { loading: loadingUpdateCartItemQuantities, error: errorUpdateCartItemQuantities }] = useMutation(UPDATE_CARTITEM_QUANTITY, {
        onCompleted: (data) => {
            console.log('Respuesta exitosa:', data);
        },
        onError: (error) => {
            console.error('Error al actualizar la cantidad del carrito:', error);
        },
    });

    const [removeFromCart, { loading: loadingRemoveFromCart, error: errorRemoveFromCart }] = useMutation(REMOVE_FROM_CART, {
        onCompleted: (data) => {
            console.log('Respuesta exitosa:', data);
        },
        onError: (error) => {
            console.error('Error al eliminar del carrito:', error);
        },
    });

    const { loading: cartLoading, error: cartError } = useQuery(GET_CART, {
        fetchPolicy: 'network-only',
        onCompleted: (data) => {
            console.log('Carrito obtenido exitosamente:', data);
            setCartData(data);
        },
        onError: (error) => {
            console.error('Error al obtener el carrito:', error);
            showToast({
                type: 'danger',
                message: 'Error al cargar el carrito',
            });
        },
    });

    const handleAddToCart = async (productId: number, variationId: number, quantity: number) => {
        try {            
            const response = await addToCart({ 
                variables: { 
                    input: {
                        productId,
                        variationId: variationId || null,
                        quantity
                    }
                } 
            });
                        
            if (!response?.data?.addToCart?.cartItem) {
                throw new Error('No se recibió una respuesta válida del servidor');
            }
            
            return response.data.addToCart.cartItem;
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            showToast({
                type: 'danger',
                message: 'Error al agregar al carrito: ' + (error instanceof Error ? error.message : 'Error desconocido'),
            });
            return null;
        }
    };

    const getCheckoutUrl = async () => {
        try {
            const clientSessionId = generateClientSessionId();
            const expirationTime = Math.floor(new Date().getTime() / 1000) + 3600;

            console.log('Enviando datos de sesión:', {
                clientSessionId,
                expirationTime
            });

            const response = await updateSession({
                variables: {
                    input: {
                        sessionData: [
                            {
                                key: 'client_session_id',
                                value: clientSessionId
                            },
                            {
                                key: 'client_session_id_expiration',
                                value: expirationTime.toString()
                            }
                        ]
                    }
                }
            });

            console.log('Respuesta del servidor:', response);

            if (response?.data?.updateSession?.errors?.length > 0) {
                const error = response.data.updateSession.errors[0];
                throw new Error(error.message || 'Error al procesar la sesión');
            }

            if (!response?.data?.updateSession?.customer?.checkoutUrl) {
                throw new Error('No se pudo obtener la URL de checkout');
            }

            return response.data.updateSession.customer.checkoutUrl;
        } catch (error) {
            console.error('Error detallado al obtener la URL de checkout:', error);
            showToast({
                type: 'danger',
                message: 'Error al procesar el checkout: ' + (error instanceof Error ? error.message : 'Error desconocido'),
            });
            throw error;
        }
    }

    function generateClientSessionId() {
        const userAgent = navigator.userAgent;
        const rawId = `${userAgent}-${Date.now()}`;
        const secretKey = process.env.NEXT_PUBLIC_NONCE_KEY as string + process.env.NEXT_PUBLIC_NONCE_SALT as string;
        return HmacMD5(rawId, secretKey).toString();
    }

    const handleUpdateCartItemQuantities = async (items: { key: string; quantity: number }[]) => {
        try {
            const response = await updateCartItemQuantities({
                variables: {
                    items
                }
            });

            if (!response?.data?.updateItemQuantities) {
                throw new Error('No se recibió una respuesta válida del servidor');
            }

            setCartData((prevData: any) => ({
                ...prevData,
                cart: response.data.updateItemQuantities.cart
            }));
            return response.data.updateItemQuantities;
        } catch (error) {
            console.error('Error al actualizar la cantidad del carrito:', error);
            showToast({
                type: 'danger',
                message: 'Error al actualizar la cantidad del carrito: ' + (error instanceof Error ? error.message : 'Error desconocido'),
            });
        }
    }
    
    const handleRemoveFromCart = async (key: string) => {
        try {
            const response = await removeFromCart({
                variables: {
                    keys: [key],
                    all: false
                }
            });

            if (!response?.data?.removeItemsFromCart) {
                throw new Error('No se recibió una respuesta válida del servidor');
            }

            setCartData((prevData: any) => ({
                ...prevData,
                cart: response.data.removeItemsFromCart.cart
            }));
            return response.data.removeItemsFromCart;
        } catch (error) {
            console.error('Error al eliminar del carrito:', error);
            showToast({
                type: 'danger',
                message: 'Error al eliminar del carrito: ' + (error instanceof Error ? error.message : 'Error desconocido'),
            });
        }
    }
    

    return { 
        handleAddToCart, 
        loadingAddToCart, 
        errorAddToCart, 
        getCheckoutUrl, 
        cartData,
        cartLoading,
        cartError,
        handleUpdateCartItemQuantities,
        handleRemoveFromCart
    };
};