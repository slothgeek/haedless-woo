'use client'
import ShopMain from "@/components/layout/shop/main";
import ShopAside from "@/components/layout/shop/aside";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { useParams } from "next/navigation";

export default function Store() {

  const { category } = useParams();

  return (
    <>
      <div className="bg-gray-100 mb-6">
        <div className="container mx-auto h-[180px] flex flex-col items-start justify-center p-4">
          <h1 className="!text-5xl !font-black">Shop</h1>
          <Breadcrumbs />
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] min-h-screen gap-4 font-[family-name:var(--font-geist-sans)]">
        <ShopAside />
        <ShopMain category={category as string} />
      </div>
    </>
  );
}