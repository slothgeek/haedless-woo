'use client';

import { Button } from "@heroui/react";
import Link from "next/link";
import { LuMapPin, LuShoppingCart, LuLock, LuUser, LuLogOut } from "react-icons/lu";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import clsx from 'clsx';

const menuItems = [
    {
        label: "Pedidos",
        href: "/account/orders",
        icon: LuShoppingCart
    },
    {
        label: "Direcciones",
        href: "/account/addresses",
        icon: LuMapPin
    },
    {
        label: "Contraseña",
        href: "/account/password",
        icon: LuLock
    },
    {
        label: "Detalles",
        href: "/account/details",
        icon: LuUser
    }
]

export default function AccountMenu() {
    const pathname = usePathname();
    const { logout } = useLogout();

    const isActive = (href: string) => {
        return pathname.endsWith(href);
    }

    return (
        <div className="p-1">
            <ul className="space-y-4">
                { 
                    menuItems.map((item) => (
                        <li key={item.href}>
                            <Button className={clsx("justify-start text-foreground", isActive(item.href) && "bg-primary text-primary-foreground")} radius="sm" variant="light" color="default" fullWidth as={Link} href={item.href} startContent={<item.icon className="w-5 h-5" />}>{item.label}</Button>
                        </li>
                    ))
                }
                <li>
                    <Button className="justify-start text-foreground" radius="sm" variant="light" color="default" fullWidth onPress={() => logout('/')} startContent={<LuLogOut className="w-5 h-5" />}>Cerrar sesión</Button>
                </li>
            </ul>
        </div>
    )
}