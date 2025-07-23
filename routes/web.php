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
| RUTAS PARA ADMINISTRADOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:administrador'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard del administrador
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // === GESTIÓN DE USUARIOS ===
    Route::get('/usuarios', function () {
        return Inertia::render('Admin/Usuarios');
    })->name('usuarios');

    Route::get('/usuarios/crear', function () {
        return Inertia::render('Admin/CrearUsuario');
    })->name('usuarios.crear');

    Route::get('/usuarios/create', function () {
        return Inertia::render('Admin/CrearUsuario');
    })->name('usuarios.create');

    Route::get('/usuarios/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarUsuario', [
            'usuarioId' => $id
        ]);
    })->name('usuarios.editar');

    // === GESTIÓN DE DEPARTAMENTOS ===
    Route::get('/departamentos', function () {
        return Inertia::render('Admin/Departamentos');
    })->name('departamentos');

    Route::get('/departamentos/crear', function () {
        return Inertia::render('Admin/CrearDepartamento');
    })->name('departamentos.crear');

    Route::get('/departamentos/{id}', function ($id) {
        return Inertia::render('Admin/VerDepartamento', [
            'departamentoId' => $id
        ]);
    })->name('departamentos.ver');

    Route::get('/departamentos/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarDepartamento', [
            'departamentoId' => $id
        ]);
    })->name('departamentos.editar');

    // === GESTIÓN DE PROPIEDADES ===
    Route::get('/propiedades', function () {
        return Inertia::render('Admin/Propiedades');
    })->name('propiedades');

    Route::get('/propiedades/crear', function () {
        return Inertia::render('Admin/CrearPropiedad');
    })->name('propiedades.crear');

    Route::get('/propiedades/create', function () {
        return Inertia::render('Admin/CrearPropiedad');
    })->name('propiedades.create');

    Route::get('/propiedades/{id}', function ($id) {
        return Inertia::render('Admin/VerPropiedad', [
            'propiedadId' => $id
        ]);
    })->name('propiedades.ver');

    Route::get('/propiedades/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarPropiedad', [
            'propiedadId' => $id
        ]);
    })->name('propiedades.editar');

    // === GESTIÓN DE VENTAS ===
    Route::get('/ventas', function () {
        return Inertia::render('Admin/Ventas');
    })->name('ventas');

    Route::get('/ventas/crear', function () {
        return Inertia::render('Admin/CrearVenta');
    })->name('ventas.crear');

    Route::get('/ventas/{id}', function ($id) {
        return Inertia::render('Admin/VerVenta', [
            'ventaId' => $id
        ]);
    })->name('ventas.ver');

    Route::get('/ventas/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarVenta', [
            'ventaId' => $id
        ]);
    })->name('ventas.editar');

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
| RUTAS PARA ASESOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:asesor'])->prefix('asesor')->name('asesor.')->group(function () {
    // Dashboard del asesor
    Route::get('/dashboard', function () {
        return Inertia::render('Asesor/Dashboard');
    })->name('dashboard');

    // === PERFIL Y CONFIGURACIÓN ===
    Route::get('/perfil', function () {
        return Inertia::render('Asesor/Perfil');
    })->name('perfil');

    Route::get('/configuracion', function () {
        return Inertia::render('Asesor/Configuracion');
    })->name('configuracion');

    // === GESTIÓN DE CLIENTES ===
    Route::get('/clientes', function () {
        return Inertia::render('Asesor/Clientes');
    })->name('clientes');

    // === GESTIÓN DE PROPIEDADES ===
    Route::get('/propiedades', function () {
        return Inertia::render('Asesor/Propiedades');
    })->name('propiedades');

    // === SOLICITUDES DE CONTACTO ===
    Route::get('/solicitudes', function () {
        return Inertia::render('Asesor/Solicitudes');
    })->name('solicitudes');

    Route::get('/solicitudes/{id}', function ($id) {
        return Inertia::render('Asesor/Solicitudes/Detalle', [
            'solicitudId' => $id
        ]);
    })->name('solicitudes.detalle');

    // === COTIZACIONES ===
    Route::get('/cotizaciones', function () {
        return Inertia::render('Asesor/Cotizaciones');
    })->name('cotizaciones');

    Route::get('/cotizaciones/crear', function () {
        return Inertia::render('Asesor/Cotizaciones/Crear');
    })->name('cotizaciones.crear');

    Route::get('/cotizaciones/crear/{solicitudId}', function ($solicitudId) {
        return Inertia::render('Asesor/Cotizaciones/Crear', [
            'solicitudId' => $solicitudId
        ]);
    })->name('cotizaciones.crear.desde.solicitud');

    Route::get('/cotizaciones/{id}', function ($id) {
        return Inertia::render('Asesor/Cotizaciones/Detalle', [
            'cotizacionId' => $id
        ]);
    })->name('cotizaciones.detalle');

    Route::get('/cotizaciones/editar/{id}', function ($id) {
        return Inertia::render('Asesor/Cotizaciones/Editar', [
            'cotizacionId' => $id
        ]);
    })->name('cotizaciones.editar');

    // === RESERVAS ===
    Route::get('/reservas', function () {
        return Inertia::render('Asesor/Reservas');
    })->name('reservas');

    Route::get('/reservas/crear', function () {
        return Inertia::render('Asesor/CrearReserva');
    })->name('reservas.crear');

    Route::get('/reservas/crear/{cotizacionId}', function ($cotizacionId) {
        return Inertia::render('Asesor/CrearReserva', [
            'cotizacionId' => $cotizacionId
        ]);
    })->name('reservas.crear.desde.cotizacion');

    Route::get('/reservas/{id}', function ($id) {
        return Inertia::render('Asesor/DetalleReserva', [
            'reservaId' => $id
        ]);
    })->name('reservas.detalle');

    // === VENTAS ===
    Route::get('/ventas', function () {
        return Inertia::render('Asesor/Ventas');
    })->name('ventas');

    Route::get('/ventas/crear', function () {
        return Inertia::render('Asesor/Ventas/Crear');
    })->name('ventas.crear');

    Route::get('/ventas/crear/{reservaId}', function ($reservaId) {
        return Inertia::render('Asesor/Ventas/Crear', [
            'reservaId' => $reservaId
        ]);
    })->name('ventas.crear.desde.reserva');

    Route::get('/ventas/{id}', function ($id) {
        return Inertia::render('Asesor/Ventas/Detalle', [
            'ventaId' => $id
        ]);
    })->name('ventas.detalle');

    Route::get('/ventas/documentos/{id}', function ($id) {
        return Inertia::render('Asesor/Ventas/Documentos', [
            'ventaId' => $id
        ]);
    })->name('ventas.documentos');

    // === COMISIONES ===
    Route::get('/comisiones', function () {
        return Inertia::render('Asesor/Comisiones');
    })->name('comisiones');
});

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
