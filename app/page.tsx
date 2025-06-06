
import ShopMain from "@/components/layout/shop/main";
import ShopAside from "@/components/layout/shop/aside";
import Breadcrumbs from "@/components/layout/breadcrumbs";

export default function Home() {
  return (
    <>
      <div className="bg-gray-100 p- mb-4">
        <div className="container mx-auto h-[140px] flex items-center justify-start">
          <h1 className="!text-5xl !font-black">Shop</h1>
          <Breadcrumbs />
        </div>
      </div>
      <div className="grid md:grid-cols-[200px_1fr] lg:grid-cols-[380px_1fr] min-h-screen gap-4 px-8 font-[family-name:var(--font-geist-sans)]">
        <ShopAside />
        <ShopMain />
      </div>
    </>
  );
}
