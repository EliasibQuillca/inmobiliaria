<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Página de inicio
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Nuevas páginas para navegación dinámica
Route::get('/properties', function () {
    return Inertia::render('Properties', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

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

// Rutas protegidas por autenticación
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas para cliente
Route::middleware(['auth', 'verified'])->prefix('cliente')->name('cliente.')->group(function () {
    // Departamentos
    Route::get('/catalogo', [App\Http\Controllers\Cliente\DepartamentoController::class, 'index'])->name('catalogo');
    Route::get('/departamentos/buscar', [App\Http\Controllers\Cliente\DepartamentoController::class, 'search'])->name('departamentos.search');
    Route::get('/departamentos/{id}', [App\Http\Controllers\Cliente\DepartamentoController::class, 'show'])->name('departamentos.show');
    Route::post('/departamentos/{id}/favorito', [App\Http\Controllers\Cliente\DepartamentoController::class, 'agregarFavorito'])->name('departamentos.favorito.agregar');
    Route::delete('/departamentos/{id}/favorito', [App\Http\Controllers\Cliente\DepartamentoController::class, 'eliminarFavorito'])->name('departamentos.favorito.eliminar');

    // Solicitudes
    Route::get('/solicitudes', [App\Http\Controllers\Cliente\SolicitudController::class, 'index'])->name('solicitudes.index');
    Route::get('/solicitudes/crear', [App\Http\Controllers\Cliente\SolicitudController::class, 'create'])->name('solicitudes.create');
    Route::post('/solicitudes', [App\Http\Controllers\Cliente\SolicitudController::class, 'store'])->name('solicitudes.store');
    Route::get('/solicitudes/{id}', [App\Http\Controllers\Cliente\SolicitudController::class, 'show'])->name('solicitudes.show');
    Route::patch('/solicitudes/{id}', [App\Http\Controllers\Cliente\SolicitudController::class, 'update'])->name('solicitudes.update');
    Route::post('/solicitudes/{id}/comentarios', [App\Http\Controllers\Cliente\SolicitudController::class, 'addComment'])->name('solicitudes.comentarios.store');
});

// Rutas para el panel de asesor
Route::middleware(['auth', 'verified'])->prefix('asesor')->group(function () {
    // Dashboard del asesor
    Route::get('/dashboard', function () {
        return Inertia::render('Asesor/Dashboard');
    })->name('asesor.dashboard');

    // Solicitudes de contacto
    Route::get('/solicitudes', function () {
        return Inertia::render('Asesor/Solicitudes');
    })->name('asesor.solicitudes');

    Route::get('/solicitudes/{id}', function ($id) {
        return Inertia::render('Asesor/Solicitudes/Detalle', [
            'solicitudId' => $id
        ]);
    })->name('asesor.solicitudes.detalle');

    // Cotizaciones
    Route::get('/cotizaciones', function () {
        return Inertia::render('Asesor/Cotizaciones');
    })->name('asesor.cotizaciones');

    Route::get('/cotizaciones/crear', function () {
        return Inertia::render('Asesor/Cotizaciones/Crear');
    })->name('asesor.cotizaciones.crear');

    Route::get('/cotizaciones/crear/{solicitudId}', function ($solicitudId) {
        return Inertia::render('Asesor/Cotizaciones/Crear', [
            'solicitudId' => $solicitudId
        ]);
    })->name('asesor.cotizaciones.crear.desde.solicitud');

    Route::get('/cotizaciones/{id}', function ($id) {
        return Inertia::render('Asesor/Cotizaciones/Detalle', [
            'cotizacionId' => $id
        ]);
    })->name('asesor.cotizaciones.detalle');

    Route::get('/cotizaciones/editar/{id}', function ($id) {
        return Inertia::render('Asesor/Cotizaciones/Editar', [
            'cotizacionId' => $id
        ]);
    })->name('asesor.cotizaciones.editar');

    // Reservas
    Route::get('/reservas', function () {
        return Inertia::render('Asesor/Reservas');
    })->name('asesor.reservas');

    Route::get('/reservas/crear', function () {
        return Inertia::render('Asesor/Reservas/Crear');
    })->name('asesor.reservas.crear');

    Route::get('/reservas/crear/{cotizacionId}', function ($cotizacionId) {
        return Inertia::render('Asesor/Reservas/Crear', [
            'cotizacionId' => $cotizacionId
        ]);
    })->name('asesor.reservas.crear.desde.cotizacion');

    Route::get('/reservas/{id}', function ($id) {
        return Inertia::render('Asesor/Reservas/Detalle', [
            'reservaId' => $id
        ]);
    })->name('asesor.reservas.detalle');

    // Ventas
    Route::get('/ventas', function () {
        return Inertia::render('Asesor/Ventas');
    })->name('asesor.ventas');

    Route::get('/ventas/crear', function () {
        return Inertia::render('Asesor/Ventas/Crear');
    })->name('asesor.ventas.crear');

    Route::get('/ventas/crear/{reservaId}', function ($reservaId) {
        return Inertia::render('Asesor/Ventas/Crear', [
            'reservaId' => $reservaId
        ]);
    })->name('asesor.ventas.crear.desde.reserva');

    Route::get('/ventas/{id}', function ($id) {
        return Inertia::render('Asesor/Ventas/Detalle', [
            'ventaId' => $id
        ]);
    })->name('asesor.ventas.detalle');

    Route::get('/ventas/documentos/{id}', function ($id) {
        return Inertia::render('Asesor/Ventas/Documentos', [
            'ventaId' => $id
        ]);
    })->name('asesor.ventas.documentos');
});

// Rutas para el panel de administrador
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    // Dashboard del administrador
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    // Gestión de usuarios
    Route::get('/usuarios', function () {
        return Inertia::render('Admin/Usuarios');
    })->name('admin.usuarios');

    Route::get('/usuarios/crear', function () {
        return Inertia::render('Admin/CrearUsuario');
    })->name('admin.usuarios.crear');

    Route::get('/usuarios/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarUsuario', [
            'usuarioId' => $id
        ]);
    })->name('admin.usuarios.editar');

    // Gestión de departamentos
    Route::get('/departamentos', function () {
        return Inertia::render('Admin/Departamentos');
    })->name('admin.departamentos');

    Route::get('/departamentos/crear', function () {
        return Inertia::render('Admin/CrearDepartamento');
    })->name('admin.departamentos.crear');

    Route::get('/departamentos/{id}', function ($id) {
        return Inertia::render('Admin/VerDepartamento', [
            'departamentoId' => $id
        ]);
    })->name('admin.departamentos.ver');

    Route::get('/departamentos/{id}/editar', function ($id) {
        return Inertia::render('Admin/EditarDepartamento', [
            'departamentoId' => $id
        ]);
    })->name('admin.departamentos.editar');

    // Reportes
    Route::get('/reportes', function () {
        return Inertia::render('Admin/Reportes');
    })->name('admin.reportes');

    Route::get('/reportes/generar', function () {
        return Inertia::render('Admin/GenerarReporte');
    })->name('admin.reportes.generar');

    Route::get('/reportes/{id}', function ($id) {
        return Inertia::render('Admin/VerReporte', [
            'reporteId' => $id
        ]);
    })->name('admin.reportes.ver');

    // Otras secciones de administración
    Route::get('/configuracion', function () {
        return Inertia::render('Admin/Configuracion');
    })->name('admin.configuracion');

    Route::get('/actividades', function () {
        return Inertia::render('Admin/Actividades');
    })->name('admin.actividades');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
