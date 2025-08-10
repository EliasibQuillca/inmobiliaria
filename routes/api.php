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
use App\Http\Controllers\Api\AsesorController;
use App\Http\Controllers\Admin\ReporteController as AdminReporteController;
use App\Http\Controllers\Admin\SimpleReporteController;

/*
|--------------------------------------------------------------------------
| API Routes - Sistema Inmobiliario
|--------------------------------------------------------------------------
|
| Aquí se registran las rutas de la API REST para el sistema inmobiliario.
| Todas las rutas están versionadas (v1) y organizadas por funcionalidad.
| Las rutas protegidas requieren autenticación mediante Sanctum.
|
*/

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Sin Autenticación)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // === RUTAS DE PRUEBA PARA REPORTES (TEMPORALES) ===
    Route::get('/test-reportes/{tipo}', [SimpleReporteController::class, 'obtenerReporte']);
    Route::get('/test-reportes/{tipo}/export', [SimpleReporteController::class, 'exportarReporte']);

    // === AUTENTICACIÓN PÚBLICA ===
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register/cliente', [AuthController::class, 'registerCliente']);
    Route::post('/password/forgot', [AuthController::class, 'forgotPassword']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);

    // === RUTAS DE PRUEBA PARA REPORTES (SIN AUTENTICACIÓN) ===
    Route::prefix('admin/reportes')->group(function () {
        Route::get('/{tipo}', [ReporteController::class, 'obtenerReporte']);
        Route::get('/{tipo}/export', [ReporteController::class, 'exportarReporte']);
    });

    // === CATÁLOGO PÚBLICO ===
    Route::prefix('catalogo')->group(function () {
        Route::get('/departamentos', [DepartamentoController::class, 'index']);
        Route::get('/departamentos/destacados', [DepartamentoController::class, 'destacados']);
        Route::get('/departamentos/buscar', [DepartamentoController::class, 'buscar']);
        Route::get('/departamentos/{id}', [DepartamentoController::class, 'show']);
        Route::get('/departamentos/{id}/imagenes', [DepartamentoController::class, 'imagenes']);
    });

    // === IMÁGENES PÚBLICAS ===
    Route::prefix('imagenes')->group(function () {
        Route::get('/', [ImagenController::class, 'index']);
        Route::get('/{id}', [ImagenController::class, 'show']);
        Route::post('/verificar-url', [ImagenController::class, 'verificarUrl']);
    });

    // === INFORMACIÓN GENERAL ===
    Route::get('/estadisticas/publicas', [ReporteController::class, 'estadisticasPublicas']);
    Route::get('/ubicaciones', [DepartamentoController::class, 'ubicaciones']);
});

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS - ADMINISTRADOR
|--------------------------------------------------------------------------
*/

Route::prefix('v1/admin')->middleware(['auth:sanctum', 'role:administrador'])->group(function () {
    // === GESTIÓN DE USUARIOS ===
    Route::prefix('usuarios')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/{id}', [UserController::class, 'update']);
        Route::patch('/{id}/estado', [UserController::class, 'cambiarEstado']);
        Route::patch('/{id}/roles', [UserController::class, 'asignarRoles']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
    });

    // === GESTIÓN DE ASESORES ===
    Route::prefix('asesores')->group(function () {
        Route::get('/', [AsesorController::class, 'admin']);
        Route::get('/{id}', [AsesorController::class, 'showApi']);
        Route::get('/{id}/estadisticas', [AsesorController::class, 'estadisticas']);
        Route::get('/{id}/actividades', [AsesorController::class, 'actividades']);
        Route::get('/{id}/clientes', [AsesorController::class, 'clientesAsesor']);
        Route::put('/{id}', [AsesorController::class, 'update']);
        Route::patch('/{id}/estado', [AsesorController::class, 'cambiarEstado']);
    });

    // === GESTIÓN DE PROPIETARIOS ===
    Route::prefix('propietarios')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\PropietarioController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\PropietarioController::class, 'store']);
        Route::get('/{id}', [\App\Http\Controllers\Api\PropietarioController::class, 'show']);
        Route::put('/{id}', [\App\Http\Controllers\Api\PropietarioController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\PropietarioController::class, 'destroy']);
    });

    // === GESTIÓN DE DEPARTAMENTOS ===
    Route::prefix('departamentos')->group(function () {
        Route::get('/', [DepartamentoController::class, 'admin']);
        Route::get('/{id}', [DepartamentoController::class, 'show']);
        Route::post('/', [DepartamentoController::class, 'store']);
        Route::put('/{id}', [DepartamentoController::class, 'update']);
        Route::patch('/{id}/estado', [DepartamentoController::class, 'cambiarEstado']);
        Route::patch('/{id}/destacado', [DepartamentoController::class, 'toggleDestacado']);
        Route::patch('/{id}/publicar', [DepartamentoController::class, 'publicar']);
        Route::delete('/{id}', [DepartamentoController::class, 'destroy']);
    });

    // === GESTIÓN DE VENTAS ===
    Route::prefix('ventas')->group(function () {
        Route::get('/reporte', [ReporteController::class, 'ventasDetallado']);
        Route::post('/generar-pdf', [ReporteController::class, 'generarPdfVentas']);
    });

    // === SUPERVISIÓN DE OPERACIONES ===
    Route::prefix('operaciones')->group(function () {
        Route::get('/cotizaciones', [CotizacionController::class, 'admin']);
        Route::get('/reservas', [ReservaController::class, 'admin']);
        Route::get('/ventas', [VentaController::class, 'admin']);
        Route::patch('/cotizaciones/{id}/aprobar', [CotizacionController::class, 'aprobar']);
        Route::patch('/ventas/{id}/validar', [VentaController::class, 'validar']);
    });

    // === REPORTES ADMINISTRATIVOS ===
    Route::prefix('reportes')->group(function () {
        Route::get('/dashboard', [ReporteController::class, 'dashboard']);

        // Rutas para obtener datos de reportes
        Route::get('/ventas', [ReporteController::class, 'reporteVentas']);
        Route::get('/asesores', [ReporteController::class, 'reporteAsesores']);
        Route::get('/propiedades', [ReporteController::class, 'reportePropiedades']);
        Route::get('/usuarios', [ReporteController::class, 'reporteUsuarios']);
        Route::get('/financiero', [ReporteController::class, 'reporteFinanciero']);

        // Rutas para exportación
        Route::get('/ventas/export', [ReporteController::class, 'exportarVentas']);
        Route::get('/asesores/export', [ReporteController::class, 'exportarAsesores']);
        Route::get('/propiedades/export', [ReporteController::class, 'exportarPropiedades']);
        Route::get('/usuarios/export', [ReporteController::class, 'exportarUsuarios']);
        Route::get('/financiero/export', [ReporteController::class, 'exportarFinanciero']);
    });

    // === RUTAS PARA REPORTES (Frontend específico) ===
    Route::prefix('reportes')->group(function () {
        // Rutas dinámicas que el frontend necesita
        Route::get('/{tipo}', [ReporteController::class, 'obtenerReporte']);
        Route::get('/{tipo}/export', [ReporteController::class, 'exportarReporte']);
    });

    // === GESTIÓN DE IMÁGENES ===
    Route::prefix('imagenes')->group(function () {
        Route::get('/todas', [ImagenController::class, 'todas']);
        Route::post('/masiva', [ImagenController::class, 'cargaMasiva']);
        Route::delete('/limpiar-huerfanas', [ImagenController::class, 'limpiarHuerfanas']);
    });

    // === CONFIGURACIÓN DEL SISTEMA ===
    Route::prefix('configuracion')->group(function () {
        Route::get('/general', [UserController::class, 'configuracionGeneral']);
        Route::put('/general', [UserController::class, 'actualizarConfiguracion']);
        Route::get('/auditoria', [UserController::class, 'auditoria']);
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS - ASESOR
|--------------------------------------------------------------------------
*/

Route::prefix('v1/asesor')->middleware(['auth:sanctum', 'role:asesor'])->group(function () {
    // === DASHBOARD Y PERFIL ===
    Route::get('/dashboard', [AsesorController::class, 'dashboard']);
    Route::get('/panel/resumen', [AsesorController::class, 'panelResumen']);
    Route::get('/perfil', [AsesorController::class, 'perfil']);
    Route::put('/perfil', [AsesorController::class, 'actualizarPerfil']);

    // === GESTIÓN DE CLIENTES ===
    Route::prefix('clientes')->group(function () {
        Route::get('/', [AsesorController::class, 'clientes']);
        Route::get('/recientes', [AsesorController::class, 'clientesRecientes']);
        Route::get('/{id}', [AsesorController::class, 'detalleCliente']);
        Route::post('/{id}/notas', [AsesorController::class, 'agregarNota']);
    });

    // === GESTIÓN DE PROPIEDADES ===
    Route::prefix('propiedades')->group(function () {
        Route::get('/', [DepartamentoController::class, 'asesor']);
        Route::get('/{id}/disponibilidad', [DepartamentoController::class, 'verificarDisponibilidad']);
    });

    // === COTIZACIONES ===
    Route::prefix('cotizaciones')->group(function () {
        Route::get('/', [CotizacionController::class, 'index']);
        Route::post('/', [CotizacionController::class, 'store']);
        Route::get('/pendientes', [AsesorController::class, 'cotizacionesPendientes']);
        Route::get('/{id}', [CotizacionController::class, 'show']);
        Route::put('/{id}', [CotizacionController::class, 'update']);
        Route::patch('/{id}/enviar', [CotizacionController::class, 'enviar']);
        Route::delete('/{id}', [CotizacionController::class, 'destroy']);
    });

    // === RESERVAS ===
    Route::prefix('reservas')->group(function () {
        Route::get('/', [ReservaController::class, 'index']);
        Route::post('/', [ReservaController::class, 'store']);
        Route::get('/{id}', [ReservaController::class, 'show']);
        Route::patch('/{id}/confirmar', [ReservaController::class, 'confirmar']);
        Route::patch('/{id}/cancelar', [ReservaController::class, 'cancelar']);
    });

    // === VENTAS ===
    Route::prefix('ventas')->group(function () {
        Route::get('/', [VentaController::class, 'index']);
        Route::post('/', [VentaController::class, 'store']);
        Route::get('/{id}', [VentaController::class, 'show']);
        Route::patch('/{id}/documentos', [VentaController::class, 'entregarDocumentos']);
        Route::patch('/{id}/finalizar', [VentaController::class, 'finalizar']);
    });

    // === AGENDA Y VISITAS ===
    Route::prefix('agenda')->group(function () {
        Route::get('/visitas/proximas', [AsesorController::class, 'visitasProximas']);
        Route::get('/calendario', [AsesorController::class, 'calendario']);
        Route::post('/visitas', [AsesorController::class, 'programarVisita']);
    });

    // === COMISIONES ===
    Route::prefix('comisiones')->group(function () {
        Route::get('/', [AsesorController::class, 'comisiones']);
        Route::get('/resumen', [AsesorController::class, 'resumenComisiones']);
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS - CLIENTE
|--------------------------------------------------------------------------
*/

Route::prefix('v1/cliente')->middleware(['auth:sanctum', 'role:cliente'])->group(function () {
    // === DASHBOARD Y PERFIL ===
    Route::get('/dashboard', [UserController::class, 'dashboardCliente']);
    Route::get('/perfil', [UserController::class, 'perfilCliente']);
    Route::put('/perfil', [UserController::class, 'actualizarPerfilCliente']);

    // === FAVORITOS ===
    Route::prefix('favoritos')->group(function () {
        Route::get('/', [DepartamentoController::class, 'favoritosCliente']);
        Route::post('/{departamentoId}', [DepartamentoController::class, 'agregarFavorito']);
        Route::delete('/{departamentoId}', [DepartamentoController::class, 'eliminarFavorito']);
    });

    // === SOLICITUDES ===
    Route::prefix('solicitudes')->group(function () {
        Route::get('/', [CotizacionController::class, 'solicitudesCliente']);
        Route::post('/', [CotizacionController::class, 'crearSolicitudCliente']);
        Route::get('/{id}', [CotizacionController::class, 'detalleSolicitudCliente']);
        Route::patch('/{id}', [CotizacionController::class, 'actualizarSolicitudCliente']);
    });

    // === COTIZACIONES RECIBIDAS ===
    Route::prefix('cotizaciones')->group(function () {
        Route::get('/', [CotizacionController::class, 'cotizacionesCliente']);
        Route::patch('/{id}/aceptar', [CotizacionController::class, 'aceptar']);
        Route::patch('/{id}/rechazar', [CotizacionController::class, 'rechazar']);
    });

    // === RESERVAS ===
    Route::prefix('reservas')->group(function () {
        Route::get('/', [ReservaController::class, 'reservasCliente']);
        Route::get('/{id}', [ReservaController::class, 'detalleReservaCliente']);
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS COMUNES AUTENTICADAS
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // === AUTENTICACIÓN ===
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me', [AuthController::class, 'actualizarPerfil']);

    // === GESTIÓN DE IMÁGENES ===
    Route::prefix('imagenes')->group(function () {
        Route::post('/', [ImagenController::class, 'store']);
        Route::patch('/{id}', [ImagenController::class, 'update']);
        Route::delete('/{id}', [ImagenController::class, 'destroy']);
        Route::post('/reordenar', [ImagenController::class, 'reordenar']);
    });

    // === NOTIFICACIONES ===
    Route::prefix('notificaciones')->group(function () {
        Route::get('/', [UserController::class, 'notificaciones']);
        Route::patch('/{id}/leer', [UserController::class, 'marcarComoLeida']);
        Route::patch('/marcar-todas-leidas', [UserController::class, 'marcarTodasComoLeidas']);
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS DE PRUEBA Y UTILIDADES
|--------------------------------------------------------------------------
*/

// Ruta de estado de la API
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API Sistema Inmobiliario funcionando correctamente',
        'version' => '1.0',
        'timestamp' => now(),
        'environment' => app()->environment(),
    ]);
});

// Ruta de prueba (solo en desarrollo)
if (app()->environment('local', 'development')) {
    Route::get('/test', function () {
        return response()->json([
            'message' => 'API en modo desarrollo',
            'version' => '1.0',
            'timestamp' => now(),
        ]);
    });
}
