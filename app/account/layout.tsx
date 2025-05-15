import HeaderPage from "@/components/layout/headerPage";
import AccountMenu from "@/components/layout/account/accountMenu";

export default function AccountLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="">
    <HeaderPage title="Cuenta" />
    <div className="container mx-auto flex gap-6 py-6">
        <div className="w-[200px] border-r-1 border-gray-900">
            <AccountMenu />
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
</div>
  );
}