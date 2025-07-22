<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\CotizacionController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\ImagenController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReporteController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí puedes registrar las rutas de la API para tu aplicación. Estas
| rutas son cargadas por el RouteServiceProvider dentro del grupo "api".
|
*/

// Rutas públicas (sin autenticación)
Route::prefix('v1')->group(function () {

    // Autenticación
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register/cliente', [AuthController::class, 'registerCliente']);

    // Departamentos públicos (catálogo)
    Route::get('/departamentos', [DepartamentoController::class, 'index']);
    Route::get('/departamentos/destacados', [DepartamentoController::class, 'destacados']);
    Route::get('/departamentos/{id}', [DepartamentoController::class, 'show']);

    // Imágenes públicas (para visualización del catálogo)
    Route::get('/imagenes', [ImagenController::class, 'index']);
    Route::get('/imagenes/{id}', [ImagenController::class, 'show']);
    Route::post('/imagenes/verificar-url', [ImagenController::class, 'verificarUrl']);

});

// Rutas protegidas (requieren autenticación)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Cotizaciones
    Route::prefix('cotizaciones')->group(function () {
        Route::get('/', [CotizacionController::class, 'index']); // Lista del asesor
        Route::post('/', [CotizacionController::class, 'store']); // Crear cotización
        Route::get('/{id}', [CotizacionController::class, 'show']); // Ver específica
        Route::patch('/{id}/aceptar', [CotizacionController::class, 'aceptar']); // Aceptar
        Route::patch('/{id}/rechazar', [CotizacionController::class, 'rechazar']); // Rechazar
    });

    // Reservas
    Route::prefix('reservas')->group(function () {
        Route::get('/', [ReservaController::class, 'index']); // Lista del asesor
        Route::post('/', [ReservaController::class, 'store']); // Crear reserva
        Route::get('/{id}', [ReservaController::class, 'show']); // Ver específica
    });

    // Ventas
    Route::prefix('ventas')->group(function () {
        Route::get('/', [VentaController::class, 'index']); // Lista del asesor
        Route::post('/', [VentaController::class, 'store']); // Registrar venta
        Route::get('/{id}', [VentaController::class, 'show']); // Ver específica
        Route::patch('/{id}/entregar-documentos', [VentaController::class, 'entregarDocumentos']);
    });

    // Gestión de Imágenes (solo usuarios autenticados)
    Route::prefix('imagenes')->group(function () {
        Route::post('/', [ImagenController::class, 'store']); // Agregar imagen
        Route::patch('/{id}', [ImagenController::class, 'update']); // Actualizar imagen
        Route::delete('/{id}', [ImagenController::class, 'destroy']); // Eliminar imagen
        Route::post('/reordenar', [ImagenController::class, 'reordenar']); // Reordenar imágenes
    });

    // Rutas de administrador
    Route::prefix('admin')->middleware('role:administrador')->group(function () {

        // Departamentos (administración)
        Route::prefix('departamentos')->group(function () {
            Route::get('/', [DepartamentoController::class, 'admin']); // Lista completa
            Route::post('/', [DepartamentoController::class, 'store']); // Crear
            Route::put('/{id}', [DepartamentoController::class, 'update']); // Actualizar
            Route::patch('/{id}/estado', [DepartamentoController::class, 'cambiarEstado']); // Cambiar estado
            Route::patch('/{id}/destacado', [DepartamentoController::class, 'toggleDestacado']); // Marcar/desmarcar como destacado
            Route::delete('/{id}', [DepartamentoController::class, 'destroy']); // Eliminar departamento
        });

        // Cotizaciones (supervisión)
        Route::get('/cotizaciones', [CotizacionController::class, 'admin']);

        // Reservas (supervisión)
        Route::get('/reservas', [ReservaController::class, 'admin']);

        // Ventas (supervisión y reportes)
        Route::get('/ventas', [VentaController::class, 'admin']);

        // Gestión de usuarios
        Route::prefix('usuarios')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'update']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
        });

        // Reportes administrativos
        Route::prefix('reportes')->group(function () {
            Route::get('/dashboard', [ReporteController::class, 'dashboard']);
            Route::get('/ventas', [ReporteController::class, 'ventasPorPeriodo']);
            Route::get('/ventas/pdf', [ReporteController::class, 'generarPdfVentas']);
            Route::get('/asesores', [ReporteController::class, 'rendimientoAsesores']);
        });
    });

});

// Ruta de prueba
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Sistema Inmobiliario funcionando correctamente',
        'version' => '1.0',
        'timestamp' => now(),
    ]);
});
