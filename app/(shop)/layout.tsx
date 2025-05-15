export default function ShopLayout({ children }: {
    readonly children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}