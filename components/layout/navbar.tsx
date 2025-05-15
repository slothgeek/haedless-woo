'use client';

import Link from "next/link";
import UserMenu from "./userMenu";
import Logo from "./logo";
import MiniCart from "@/components/ui/shop/mini-cart";

export default function Navbar() {

    return (
        <nav className="container mx-auto py-4 px-4">
            <div className="flex justify-between items-center">
                <div className="flex gap-6 justify-start items-center">
                    <Logo href="/" width={100} height={100} className="text-black" />
                </div>
                <div className="flex gap-4 justify-end items-center">
                    <ul className="flex gap-6 mx-6 font-bold text-gray-500 justify-end items-center">
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/shop">Shop</Link>
                        </li>
                    </ul>
                    <UserMenu />
                    <MiniCart cartRedirect={false} />
                </div>

            </div>
        </nav>
    )
}

