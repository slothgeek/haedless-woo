import Order from "@/components/ui/account/order";

export default async function Page({params}: {params: {id: string}}){
    const {id} = await params;
    return (
        <div>
            <Order id={id} />
        </div>
    )
}