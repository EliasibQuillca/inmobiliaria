import { Head } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';

export default function TestCliente() {
    return (
        <ClienteLayout>
            <Head title="Prueba Cliente Layout" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🎉 ¡Layout Cliente funcionando!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Esta es una página de prueba para verificar que el nuevo layout de cliente está funcionando correctamente.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-2">✅ Layout Creado</h3>
                            <p className="text-blue-700 text-sm">El layout específico para cliente está funcionando</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-900 mb-2">✅ Navegación</h3>
                            <p className="text-green-700 text-sm">La navegación específica está implementada</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-900 mb-2">✅ Estilos</h3>
                            <p className="text-purple-700 text-sm">Los estilos Tailwind funcionan correctamente</p>
                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                        <h2 className="text-xl font-bold mb-2">Próximos pasos:</h2>
                        <ul className="space-y-1 text-blue-100">
                            <li>• Dashboard del cliente implementado</li>
                            <li>• Controlador actualizado con datos correctos</li>
                            <li>• Layout específico funcionando</li>
                            <li>• Sin animaciones, enfoque en funcionalidad</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ClienteLayout>
    );
}
