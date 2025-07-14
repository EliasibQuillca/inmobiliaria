<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartamentoController;
use App\Http\Controllers\Api\CotizacionController;
use App\Http\Controllers\Api\ReservaController;
use App\Http\Controllers\Api\VentaController;

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
    Route::get('/departamentos/{id}', [DepartamentoController::class, 'show']);
    
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
    
    // Rutas de administrador
    Route::prefix('admin')->middleware('role:administrador')->group(function () {
        
        // Departamentos (administración)
        Route::prefix('departamentos')->group(function () {
            Route::get('/', [DepartamentoController::class, 'admin']); // Lista completa
            Route::post('/', [DepartamentoController::class, 'store']); // Crear
            Route::put('/{id}', [DepartamentoController::class, 'update']); // Actualizar
            Route::patch('/{id}/estado', [DepartamentoController::class, 'cambiarEstado']); // Cambiar estado
        });
        
        // Cotizaciones (supervisión)
        Route::get('/cotizaciones', [CotizacionController::class, 'admin']);
        
        // Reservas (supervisión)
        Route::get('/reservas', [ReservaController::class, 'admin']);
        
        // Ventas (supervisión y reportes)
        Route::get('/ventas', [VentaController::class, 'admin']);
        
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
