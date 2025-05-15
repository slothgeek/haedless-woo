'use client'

import { Spinner } from "@heroui/react"

export default function Loading({ className, label }: { className?: string, label?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <Spinner />
            <span className="text-sm text-gray-500 animate-pulse">{label || 'Cargando...'}</span>
        </div>
    )
}