import Link from "next/link";
import Image from "next/image";

export default function Logo({ href, width, height, className }: { href?: string, width?: number, height?: number, className?: string }) {
    return (
        <Link href={href || "/"} className={className}>
            <Image src="/logo.svg" alt="Logo" width={width || 120} height={ height || 80} />
        </Link>
    )
}