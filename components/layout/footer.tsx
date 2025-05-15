'use client'

export default function Footer() {
    return (
        <footer className="bg-gray-100 py-4">
            <div className="container mx-auto px-4">
                <p className="text-center text-gray-600">
                    &copy; {new Date().getFullYear()}. All rights reserved.
                </p>
            </div>
        </footer>
    )
}