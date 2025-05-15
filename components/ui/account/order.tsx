'use client';

import { gql, useQuery } from '@apollo/client';
import { decodeUrlValue } from '@/lib/utils/helpers';
import { Accordion, AccordionItem } from "@heroui/react";

import Amount from '@/components/ui/mount';
const GET_ORDER = gql`
                    query GetOrder($id: ID = "") {
                    order(id: $id) {
                        billing {
                            address1
                            address2
                            city
                            company
                            country
                            email
                            firstName
                            lastName
                            phone
                            postcode
                            state
                        }
                        orderNumber
                        currency
                        databaseId
                        date
                        dateCompleted
                        total(format: RAW)
                        subtotal(format: RAW)
                        lineItems {
                        edges {
                            cursor
                            node {
                            id
                            databaseId
                            product {
                                node {
                                name
                                title
                                image {
                                    mediaItemUrl
                                }
                                }
                            }
                            quantity
                            subtotal
                            total
                            totalTax
                            taxes {
                                amount
                                subtotal
                                total
                                taxLineId
                                taxLine {
                                databaseId
                                id
                                label
                                shippingTaxTotal
                                taxTotal
                                }
                            }
                            taxStatus
                            taxClass
                            subtotalTax
                            }
                        }
                        }
                        feeLines {
                        nodes {
                            amount
                            databaseId
                            id
                            name
                            taxClass
                            taxStatus
                            total
                            totalTax
                            taxes {
                            amount
                            subtotal
                            taxLineId
                            total
                            taxLine {
                                label
                            }
                            }
                        }
                        }
                    }
                    }`


export default function Order({ id }: { id: string }) {
    const { data, loading, error } = useQuery(GET_ORDER, {
        variables: { id: decodeUrlValue(id) }
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1 className="mb-4">Orden #{data.order.orderNumber}</h1>
            <div className='space-y-6'>
                <div className='border-b pb-4'>
                    <h2 className='mb-4'>Detalles de la orden</h2>
                    <table className="w-full">
                        <thead className='text-lg'>
                            <tr>
                                <th className="text-left p-2">Producto</th>
                                <th className="text-right p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.order.lineItems.edges.map((item: any) => (
                                <tr key={item.node.id} className="">
                                    <td className="p-2">{item.node.product.node.name}</td>
                                    <td className="p-2 text-right"><Amount mount={item.node.total} currency={data.order.currency} /></td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className='text-lg'>
                            <tr className="font-semibold">
                                <td className="p-2">Subtotal</td>
                                <td className="p-2 text-right"><Amount mount={data.order.subtotal} currency={data.order.currency} /></td>
                            </tr>
                            <tr className="font-semibold">
                                <td className="p-2">Total</td>
                                <td className="p-2 text-right"><Amount mount={data.order.total} currency={data.order.currency} /></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div>
                    <div>
                        <Accordion variant='bordered'>
                            <AccordionItem title='Detalles de la entrega'>
                                <p>{data.order.billing.address1}</p>
                                <p>{data.order.billing.address2}</p>
                                <p>{data.order.billing.city}</p>
                                <p>{data.order.billing.postcode}</p>
                                <p>{data.order.billing.state}</p>
                                <p>{data.order.billing.country}</p>
                            </AccordionItem>
                        </Accordion>
                    </div>

                </div>
            </div>
        </div>
    );
}