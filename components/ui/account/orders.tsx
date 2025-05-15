'use client';

import { gql, useQuery } from '@apollo/client';
import { useEffect, useContext } from 'react';
import { orderStatus } from '@/lib/utils/helpers';
import { Button } from '@heroui/react'
import Link from 'next/link';
import { AccountContext } from '@/providers';
import Amount from '../mount';

const GET_ORDERS = gql`
    query GetOrders($customerId: Int!) {
      orders(where: {customerId: $customerId}) {
        edges {
          cursor
          node {
            orderNumber
            date
            total(format: RAW)
            id
            status
            currency
            billing {
              firstName
              lastName
            }
          }
        }
        nodes {
          id
        }
      }
    }
    `;

export default function Orders() {
  const { userData, isAuthenticated, authLoading } = useContext(AccountContext);
  
  const { data, loading, error, refetch } = useQuery(GET_ORDERS, {
    variables: {
      customerId: userData?.databaseId
    },
    skip: !userData?.databaseId
  });

  // Refetch cuando cambie el estado de autenticación
  useEffect(() => {
    if (isAuthenticated && userData?.databaseId) {
      refetch();
    }
  }, [isAuthenticated, userData?.databaseId, refetch]);

  if (authLoading || loading) return <div className='animate-pulse'>Cargando...</div>;

  if (!isAuthenticated) return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
      <p>Por favor inicia sesión para ver tus órdenes</p>
    </div>
  );

  if (error) return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
      <p>{error.message}</p>
      <p className="text-sm mt-2">Detalles: {error.toString()}</p>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Mis Órdenes</h2>
      {data?.orders?.edges?.length === 0 ? (
        <p>No tienes órdenes aún</p>
      ) : (
        <div className="space-y-4">
          {data?.orders?.edges?.map(({ node }: any) => (
            <div key={node.id} className="border-b p-4 w-full">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className='col-span-2 space-y-2'>
                  <p className='text-lg'><strong>Orden #{node.orderNumber}</strong></p>
                  <p className='text-sm'>Ordenado el: {new Date(node.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  <p className='text-sm'><strong><Amount mount={node.total} currency={node.currency} /></strong></p>
                </div>
                <p className='text-center'>{orderStatus(node.status)}</p>
                <div className='flex justify-end'>
                  <Button variant='bordered' as={Link} href={`/account/orders/${node.id}`}>Ver detalles</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}