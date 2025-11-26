import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-indigo-50 to-white pt-6 sm:justify-center sm:pt-0">
            <div className="mt-12 mb-8">
                <Link href="/" className="flex flex-col items-center">
                    <span className="text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent">
                        IMPERIAL
                    </span>
                    <span className="text-base text-gray-700 mt-1 font-medium">Inmobiliaria Cusco</span>
                    <span className="text-xs text-gray-500 mt-0.5">Tu hogar soñado en la ciudad imperial</span>
                </Link>
            </div>

            <div className="w-full max-w-md overflow-hidden bg-white px-8 py-8 shadow-xl rounded-xl mb-12">
                {children}
            </div>

            <div className="w-full max-w-md text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Inmobiliaria Imperial Cusco. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
