'use client';

import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection, Button } from "@heroui/react"
import { LuLogOut, LuLogIn } from "react-icons/lu";
import { AccountContext } from "@/providers";
import { useContext } from "react";

export default function UserMenu() {
    const { userData, isAuthenticated, authLoading } = useContext(AccountContext);

    const { logout } = useLogout();

    return (
        !authLoading && (
            <>
                {isAuthenticated && userData && (
                    <Dropdown>
                        <DropdownTrigger>
                            <div className="flex items-center gap-2">
                                <Avatar src={userData?.avatar} className="w-8 h-8" />
                                <span className="text-sm font-medium">{userData?.firstName}</span>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu className="text-black">
                            <DropdownItem key="account">
                                <Link href="/account">Mi Cuenta</Link>
                            </DropdownItem>
                            <DropdownItem key="orders">
                                <Link href="/account/orders">Pedidos</Link>
                            </DropdownItem>
                            <DropdownSection className="border-gray-200 border-t-1 pt-2">
                                <DropdownItem key="wordpress">
                                    <Link href="http://store.woo.local/my-account/" target="_blank">Wordpress</Link>
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection className="border-gray-200 border-t-1 pt-2">
                                <DropdownItem key="logout" onPress={() => logout('/')} className="text-red-500" startContent={<LuLogOut className="w-4 h-4" />}>
                                    Cerrar Sesión
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>
                )}
                {!isAuthenticated && (
                    <Button variant="light" color="default" startContent={<LuLogIn className="w-4 h-4" />} as={Link} href="/signin">
                        Login
                    </Button>
                )}
            </>
        )

    )
}