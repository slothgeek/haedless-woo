'use client'

import ProductResume from '@/components/ui/shop/product-resume';
import useProduct from '@/hooks/useProduct';
import { useParams } from "next/navigation";
import Loading from '@/components/layout/loading';

export default function ProductPage() {
    const { slug } = useParams();
    const { product, loading, error } = useProduct(slug as string, 'SLUG');

    if (loading) return  <Loading className='h-[500px]' />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <ProductResume product={product} />
        </div>
    )
}