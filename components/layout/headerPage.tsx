import Breadcrumbs from "./breadcrumbs";

export default function HeaderPage({ title }: { title: string }) {
    return (
        <header className="bg-gray-500/10">
            <div className="container mx-auto py-12">
                <h1 className="text-3xl font-bold">{title}</h1>
                <div className="flex gap-4">
                    <Breadcrumbs />
                </div>
            </div>
        </header>
    )
}