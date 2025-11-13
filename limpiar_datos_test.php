<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Cliente;
use App\Models\Asesor;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Models\Venta;
use Illuminate\Support\Facades\DB;

echo "\n";
echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║     LIMPIEZA DE DATOS DE PRUEBA                                   ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

try {
    DB::beginTransaction();

    // 1. Eliminar ventas de test
    $ventasEliminadas = Venta::whereHas('reserva', function($q) {
        $q->whereHas('cotizacion', function($q2) {
            $q2->whereHas('cliente', function($q3) {
                $q3->where('email', 'LIKE', '%test%')
                  ->orWhere('dni', 'LIKE', '%1234%')
                  ->orWhere('dni', 'LIKE', 'TEMP-%');
            });
        });
    })->delete();

    echo "✅ Ventas de test eliminadas: $ventasEliminadas\n";

    // 2. Eliminar reservas de test
    $reservasEliminadas = Reserva::whereHas('cotizacion', function($q) {
        $q->whereHas('cliente', function($q2) {
            $q2->where('email', 'LIKE', '%test%')
              ->orWhere('dni', 'LIKE', '%1234%')
              ->orWhere('dni', 'LIKE', 'TEMP-%');
        });
    })->delete();

    echo "✅ Reservas de test eliminadas: $reservasEliminadas\n";

    // 3. Eliminar cotizaciones de test
    $cotizacionesEliminadas = Cotizacion::whereHas('cliente', function($q) {
        $q->where('email', 'LIKE', '%test%')
          ->orWhere('dni', 'LIKE', '%1234%')
          ->orWhere('dni', 'LIKE', 'TEMP-%');
    })->delete();

    echo "✅ Cotizaciones de test eliminadas: $cotizacionesEliminadas\n";

    // 4. Eliminar clientes de test
    $clientesEliminados = Cliente::where('email', 'LIKE', '%test%')
        ->orWhere('dni', 'LIKE', '%1234%')
        ->orWhere('dni', 'LIKE', 'TEMP-%')
        ->delete();

    echo "✅ Clientes de test eliminados: $clientesEliminados\n";

    // 5. Eliminar usuarios asesor de test (primero quitamos la relación)
    $asesoresTest = Asesor::where('documento', 'LIKE', '%8765%')->get();
    $usuariosAsesorIds = $asesoresTest->pluck('usuario_id')->toArray();
    $asesoresEliminados = Asesor::where('documento', 'LIKE', '%8765%')->delete();
    echo "✅ Asesores de test eliminados: $asesoresEliminados\n";

    // 6. Eliminar usuarios de test
    $usuariosEliminados = User::where('email', 'LIKE', '%test%')
        ->orWhereIn('id', $usuariosAsesorIds)
        ->delete();

    echo "✅ Usuarios de test eliminados: $usuariosEliminados\n";

    // 7. Resetear departamentos vendidos en el test
    $departamentos = DB::table('departamentos')
        ->where('estado', 'vendido')
        ->where('titulo', 'LIKE', '%Test%')
        ->update([
            'estado' => 'disponible',
            'activo' => true
        ]);

    echo "✅ Departamentos de test reseteados: $departamentos\n";

    DB::commit();

    echo "\n";
    echo "╔════════════════════════════════════════════════════════════════════╗\n";
    echo "║     ✅ LIMPIEZA COMPLETADA EXITOSAMENTE                           ║\n";
    echo "╚════════════════════════════════════════════════════════════════════╝\n";
    echo "\n";
    echo "Ahora puedes:\n";
    echo "1. Iniciar sesión como asesor\n";
    echo "2. Ver que no hay solicitudes de prueba\n";
    echo "3. Probar el flujo completo manualmente desde el navegador\n\n";

} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ ERROR durante la limpieza: {$e->getMessage()}\n";
    echo "Archivo: {$e->getFile()}\n";
    echo "Línea: {$e->getLine()}\n\n";
    exit(1);
}
