import HeaderPage from "@/components/layout/headerPage";
import AccountMenu from "@/components/layout/account/accountMenu";

export default function AccountLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="">
    <HeaderPage title="Carrito de compras" />
    <div className="container mx-auto">
        <div className="flex-1">
            {children}
        </div>
    </div>
</div>
  );
}