<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

// Página de inicio
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Páginas informativas
Route::get('/about', function () {
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/services', function () {
    return Inertia::render('Services', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/contact', function () {
    return Inertia::render('Contact', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Catálogo de propiedades (público)
Route::get('/catalogo', [\App\Http\Controllers\CatalogoController::class, 'index']);
Route::get('/catalogo/{id}', [\App\Http\Controllers\CatalogoController::class, 'show']);

// Mantener la ruta properties por compatibilidad (redirige a catalogo)
Route::get('/properties', function () {
    return redirect('/catalogo');
});

/*
|--------------------------------------------------------------------------
| DASHBOARD PRINCIPAL (REDIRIGE SEGÚN ROL)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();

    // Redirigir según el rol del usuario
    if ($user->hasRole('administrador')) {
        return redirect()->route('admin.dashboard');
    } elseif ($user->hasRole('asesor')) {
        return redirect()->route('asesor.dashboard');
    } elseif ($user->hasRole('cliente')) {
        return redirect()->route('cliente.dashboard');
    }

    // Dashboard por defecto si no tiene rol específico
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| RUTAS PARA CLIENTE
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->prefix('cliente')->name('cliente.')->group(function () {
    // === DASHBOARD Y PERFIL ===
    Route::get('/dashboard', [App\Http\Controllers\Cliente\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/perfil', [App\Http\Controllers\Cliente\DashboardController::class, 'perfil'])->name('perfil');
    Route::patch('/perfil', [App\Http\Controllers\Cliente\DashboardController::class, 'actualizarPerfil'])->name('perfil.update');

    // === FAVORITOS Y ASESORES ===
    Route::get('/favoritos', [App\Http\Controllers\Cliente\DashboardController::class, 'favoritos'])->name('favoritos');
    Route::get('/asesores', [App\Http\Controllers\Cliente\DashboardController::class, 'asesores'])->name('asesores');

    // === DEPARTAMENTOS Y CATÁLOGO ===
    Route::get('/catalogo', [App\Http\Controllers\Cliente\DepartamentoController::class, 'index'])->name('catalogo');
    Route::get('/departamentos/buscar', [App\Http\Controllers\Cliente\DepartamentoController::class, 'search'])->name('departamentos.search');
    Route::get('/departamentos/{id}', [App\Http\Controllers\Cliente\DepartamentoController::class, 'show'])->name('departamentos.show');
    Route::post('/departamentos/{id}/favorito', [App\Http\Controllers\Cliente\DepartamentoController::class, 'agregarFavorito'])->name('departamentos.favorito.agregar');
    Route::delete('/departamentos/{id}/favorito', [App\Http\Controllers\Cliente\DepartamentoController::class, 'eliminarFavorito'])->name('departamentos.favorito.eliminar');

    // === SOLICITUDES ===
    Route::get('/solicitudes', [App\Http\Controllers\Cliente\SolicitudController::class, 'index'])->name('solicitudes.index');
    Route::get('/solicitudes/crear', [App\Http\Controllers\Cliente\SolicitudController::class, 'create'])->name('solicitudes.create');
    Route::post('/solicitudes', [App\Http\Controllers\Cliente\SolicitudController::class, 'store'])->name('solicitudes.store');
    Route::get('/solicitudes/{id}', [App\Http\Controllers\Cliente\SolicitudController::class, 'show'])->name('solicitudes.show');
    Route::patch('/solicitudes/{id}', [App\Http\Controllers\Cliente\SolicitudController::class, 'update'])->name('solicitudes.update');
    Route::post('/solicitudes/{id}/comentarios', [App\Http\Controllers\Cliente\SolicitudController::class, 'addComment'])->name('solicitudes.comentarios.store');
});

/*
|--------------------------------------------------------------------------
| RUTAS PARA ASESOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:asesor'])->prefix('asesor')->name('asesor.')->group(function () {
    // Dashboard del asesor
    Route::get('/dashboard', [\App\Http\Controllers\Asesor\DashboardController::class, 'index'])->name('dashboard');

    // === PERFIL Y CONFIGURACIÓN ===
    Route::get('/perfil', [\App\Http\Controllers\Asesor\PerfilController::class, 'index'])->name('perfil');
    Route::patch('/perfil', [\App\Http\Controllers\Asesor\PerfilController::class, 'update'])->name('perfil.update');
    Route::patch('/perfil/password', [\App\Http\Controllers\Asesor\PerfilController::class, 'updatePassword'])->name('perfil.password.update');

    Route::get('/configuracion', [\App\Http\Controllers\Asesor\ConfiguracionController::class, 'index'])->name('configuracion');
    Route::patch('/configuracion/notificaciones', [\App\Http\Controllers\Asesor\ConfiguracionController::class, 'updateNotificaciones'])->name('configuracion.notificaciones');
    Route::patch('/configuracion/horarios', [\App\Http\Controllers\Asesor\ConfiguracionController::class, 'updateHorarios'])->name('configuracion.horarios');
    Route::patch('/configuracion/comisiones', [\App\Http\Controllers\Asesor\ConfiguracionController::class, 'updateComisiones'])->name('configuracion.comisiones');

    // === GESTIÓN DE CLIENTES ===
    Route::resource('clientes', \App\Http\Controllers\Asesor\ClienteController::class);

    // === SOLICITUDES DE CONTACTO ===
    Route::get('/solicitudes', [\App\Http\Controllers\Asesor\SolicitudController::class, 'index'])->name('solicitudes');
    Route::post('/solicitudes/contacto', [\App\Http\Controllers\Asesor\SolicitudController::class, 'registrarContacto'])->name('solicitudes.contacto');
    Route::patch('/solicitudes/{cliente}/seguimiento', [\App\Http\Controllers\Asesor\SolicitudController::class, 'actualizarSeguimiento'])->name('solicitudes.seguimiento');
    Route::get('/solicitudes/{cliente}/historial', [\App\Http\Controllers\Asesor\SolicitudController::class, 'historialCliente'])->name('solicitudes.historial');
    Route::post('/solicitudes/{cliente}/cita', [\App\Http\Controllers\Asesor\SolicitudController::class, 'agendarCita'])->name('solicitudes.cita');
    Route::get('/solicitudes/buscar-departamentos', [\App\Http\Controllers\Asesor\SolicitudController::class, 'buscarDepartamentos'])->name('solicitudes.buscar');

    // === COTIZACIONES ===
    Route::get('/cotizaciones', [\App\Http\Controllers\Asesor\CotizacionController::class, 'index'])->name('cotizaciones');
    Route::get('/cotizaciones/create', [\App\Http\Controllers\Asesor\CotizacionController::class, 'create'])->name('cotizaciones.create');
    Route::post('/cotizaciones', [\App\Http\Controllers\Asesor\CotizacionController::class, 'store'])->name('cotizaciones.store');
    Route::patch('/cotizaciones/{cotizacion}/estado', [\App\Http\Controllers\Asesor\CotizacionController::class, 'updateEstado'])->name('cotizaciones.estado');
    Route::get('/cotizaciones/{cotizacion}/edit', [\App\Http\Controllers\Asesor\CotizacionController::class, 'edit'])->name('cotizaciones.edit');
    Route::patch('/cotizaciones/{cotizacion}', [\App\Http\Controllers\Asesor\CotizacionController::class, 'update'])->name('cotizaciones.update');

    // === RESERVAS ===
    Route::get('/reservas', [\App\Http\Controllers\Asesor\ReservaController::class, 'index'])->name('reservas');
    Route::post('/reservas', [\App\Http\Controllers\Asesor\ReservaController::class, 'store'])->name('reservas.store');
    Route::patch('/reservas/{reserva}/confirmar', [\App\Http\Controllers\Asesor\ReservaController::class, 'confirmar'])->name('reservas.confirmar');
    Route::patch('/reservas/{reserva}/cancelar', [\App\Http\Controllers\Asesor\ReservaController::class, 'cancelar'])->name('reservas.cancelar');
    Route::patch('/reservas/{reserva}', [\App\Http\Controllers\Asesor\ReservaController::class, 'update'])->name('reservas.update');

    // === VENTAS ===
    Route::get('/ventas', [\App\Http\Controllers\Asesor\VentaController::class, 'index'])->name('ventas');
    Route::get('/ventas/create', [\App\Http\Controllers\Asesor\VentaController::class, 'create'])->name('ventas.create');
    Route::post('/ventas', [\App\Http\Controllers\Asesor\VentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{venta}', [\App\Http\Controllers\Asesor\VentaController::class, 'show'])->name('ventas.show');
    Route::get('/ventas/{venta}/edit', [\App\Http\Controllers\Asesor\VentaController::class, 'edit'])->name('ventas.edit');
    Route::patch('/ventas/{venta}', [\App\Http\Controllers\Asesor\VentaController::class, 'update'])->name('ventas.update');
    Route::patch('/ventas/{venta}/documentos', [\App\Http\Controllers\Asesor\VentaController::class, 'actualizarDocumentos'])->name('ventas.documentos');

    // === COMISIONES ===
    Route::get('/comisiones', function () {
        return Inertia::render('Asesor/Comisiones');
    })->name('comisiones');
});

/*
|--------------------------------------------------------------------------
| RUTAS PARA ADMINISTRADOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:administrador'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard del administrador
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // === GESTIÓN DE USUARIOS ===
    Route::get('/usuarios', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('usuarios');

    Route::get('/usuarios/crear', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('usuarios.crear');
    Route::post('/usuarios', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('usuarios.store');

    Route::get('/usuarios/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('usuarios.create');

    Route::get('/usuarios/{id}/editar', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('usuarios.editar');
    Route::put('/usuarios/{id}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('usuarios.update');

    // Rutas para operaciones CRUD
    Route::patch('/usuarios/{id}/estado', [\App\Http\Controllers\Admin\UserController::class, 'cambiarEstado'])->name('usuarios.cambiar-estado');
    Route::delete('/usuarios/{id}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('usuarios.eliminar');

    // === GESTIÓN DE DEPARTAMENTOS ===
    Route::get('/departamentos', [\App\Http\Controllers\Admin\DepartamentoController::class, 'index'])->name('departamentos');

    Route::get('/departamentos/crear', [\App\Http\Controllers\Admin\DepartamentoController::class, 'create'])->name('departamentos.crear');
    Route::post('/departamentos', [\App\Http\Controllers\Admin\DepartamentoController::class, 'store'])->name('departamentos.store');

    Route::get('/departamentos/{id}', [\App\Http\Controllers\Admin\DepartamentoController::class, 'show'])->name('departamentos.ver');

    Route::get('/departamentos/{id}/editar', [\App\Http\Controllers\Admin\DepartamentoController::class, 'edit'])->name('departamentos.editar');
    Route::put('/departamentos/{id}', [\App\Http\Controllers\Admin\DepartamentoController::class, 'update'])->name('departamentos.update');

    // Rutas para operaciones específicas
    Route::patch('/departamentos/{id}/estado', [\App\Http\Controllers\Admin\DepartamentoController::class, 'cambiarEstado'])->name('departamentos.cambiar-estado');
    Route::patch('/departamentos/{id}/destacado', [\App\Http\Controllers\Admin\DepartamentoController::class, 'toggleDestacado'])->name('departamentos.toggle-destacado');
    Route::delete('/departamentos/{id}', [\App\Http\Controllers\Admin\DepartamentoController::class, 'destroy'])->name('departamentos.eliminar');

    // Ruta para exportar
    Route::get('/departamentos/exportar', [\App\Http\Controllers\Admin\DepartamentoController::class, 'exportar'])->name('departamentos.exportar');

    // Rutas para gestión de imágenes
    Route::post('/departamentos/{id}/imagenes', [\App\Http\Controllers\Admin\DepartamentoController::class, 'subirImagenes'])->name('departamentos.subir-imagenes');
    Route::delete('/departamentos/{id}/imagenes/{imagenId}', [\App\Http\Controllers\Admin\DepartamentoController::class, 'eliminarImagen'])->name('departamentos.eliminar-imagen');

    // === GESTIÓN DE PROPIEDADES ===
    // Redireccionar /propiedades a /departamentos para mantener consistencia
    Route::get('/propiedades', function () {
        return redirect()->route('admin.departamentos');
    })->name('propiedades');

    Route::get('/propiedades/crear', function () {
        return redirect()->route('admin.departamentos.crear');
    })->name('propiedades.crear');

    Route::get('/propiedades/create', function () {
        return redirect()->route('admin.departamentos.crear');
    })->name('propiedades.create');

    Route::get('/propiedades/{id}', function ($id) {
        return redirect()->route('admin.departamentos.ver', $id);
    })->name('propiedades.ver');

    Route::get('/propiedades/{id}/editar', function ($id) {
        return redirect()->route('admin.departamentos.editar', $id);
    })->name('propiedades.editar');

    // === GESTIÓN DE VENTAS ===
    // Ruta de prueba
    Route::get('/ventas-test', function () {
        return Inertia::render('Admin/VentasTest');
    })->name('ventas.test');

    Route::get('/ventas', [\App\Http\Controllers\Admin\VentaController::class, 'index'])->name('ventas');
    Route::get('/ventas/crear', [\App\Http\Controllers\Admin\VentaController::class, 'create'])->name('ventas.crear');
    Route::post('/ventas', [\App\Http\Controllers\Admin\VentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{id}', [\App\Http\Controllers\Admin\VentaController::class, 'show'])->name('ventas.ver');
    Route::get('/ventas/{id}/edit', [\App\Http\Controllers\Admin\VentaController::class, 'edit'])->name('ventas.editar');
    Route::put('/ventas/{id}', [\App\Http\Controllers\Admin\VentaController::class, 'update'])->name('ventas.update');
    Route::post('/ventas/reporte', [\App\Http\Controllers\Admin\VentaController::class, 'generarReporte'])->name('ventas.reporte');
    Route::delete('/ventas/{id}/cancelar', [\App\Http\Controllers\Admin\VentaController::class, 'cancelar'])->name('ventas.cancelar');

    // === REPORTES ===
    Route::get('/reportes', function () {
        return Inertia::render('Admin/Reportes');
    })->name('reportes');

    Route::get('/reportes/generar', function () {
        return Inertia::render('Admin/GenerarReporte');
    })->name('reportes.generar');

    Route::get('/reportes/{id}', function ($id) {
        return Inertia::render('Admin/VerReporte', [
            'reporteId' => $id
        ]);
    })->name('reportes.ver');

    // === CONFIGURACIÓN Y ACTIVIDADES ===
    Route::get('/configuracion', function () {
        return Inertia::render('Admin/Configuracion');
    })->name('configuracion');

    Route::get('/actividades', function () {
        return Inertia::render('Admin/Actividades');
    })->name('actividades');
});

/*
|--------------------------------------------------------------------------
| RUTAS API PARA CLIENTE
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:cliente'])->prefix('cliente/api')->name('cliente.api.')->group(function () {
    // API para búsquedas y favoritos
    Route::prefix('departamentos')->name('departamentos.')->group(function () {
        Route::get('/buscar', [App\Http\Controllers\Cliente\DepartamentoController::class, 'search'])->name('search');
        Route::get('/favoritos', [App\Http\Controllers\Cliente\DepartamentoController::class, 'getFavoritos'])->name('favoritos');
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS API PARA ASESOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:asesor'])->prefix('asesor/api')->name('asesor.api.')->group(function () {
    // API para búsquedas y estadísticas
    Route::prefix('estadisticas')->name('estadisticas.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Asesor\DashboardController::class, 'getEstadisticas'])->name('dashboard');
        Route::get('/comisiones', [\App\Http\Controllers\Asesor\ConfiguracionController::class, 'getComisiones'])->name('comisiones');
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS API PARA ADMINISTRADOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:administrador'])->prefix('admin/api')->name('admin.api.')->group(function () {
    // API para reportes
    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('/ventas', [\App\Http\Controllers\Admin\ReporteController::class, 'reporteVentas'])->name('ventas');
        Route::get('/asesores', [\App\Http\Controllers\Admin\ReporteController::class, 'reporteAsesores'])->name('asesores');
        Route::get('/propiedades', [\App\Http\Controllers\Admin\ReporteController::class, 'reportePropiedades'])->name('propiedades');
    });
});

/*
|--------------------------------------------------------------------------
| RUTAS DE PERFIL Y AUTENTICACIÓN
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
