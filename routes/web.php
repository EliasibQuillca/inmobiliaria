<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\CatalogoController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AsesorController as AdminAsesorController;
use App\Http\Controllers\Admin\DepartamentoController as AdminDepartamentoController;
use App\Http\Controllers\Admin\VentaController as AdminVentaController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReporteController as AdminReporteController;
use App\Http\Controllers\Asesor\ConfiguracionController as AsesorConfiguracionController;
use App\Http\Controllers\Asesor\DashboardController as AsesorDashboardController;
use App\Http\Controllers\Asesor\ClienteController as AsesorClienteController;
use App\Http\Controllers\Asesor\CotizacionController as AsesorCotizacionController;
use App\Http\Controllers\Asesor\ReservaController as AsesorReservaController;
use App\Http\Controllers\Asesor\PerfilController as AsesorPerfilController;
use App\Http\Controllers\Asesor\SolicitudController as AsesorSolicitudController;
use App\Http\Controllers\Asesor\VentaController as AsesorVentaController;
use App\Http\Controllers\Cliente\DashboardController as ClienteDashboardController;
use App\Http\Controllers\Cliente\DepartamentoController as ClienteDepartamentoController;
use App\Http\Controllers\Cliente\SolicitudController as ClienteSolicitudController;
use App\Http\Controllers\Cliente\ComentarioController as ClienteComentarioController;
use App\Http\Controllers\ClienteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// ============================================
// PÁGINA PRINCIPAL PÚBLICA (Catálogo Híbrido)
// ============================================
Route::get('/', function () {
    return redirect('/catalogo');
})->name('home');

// Rutas de catálogo público
Route::get('/catalogo', [CatalogoController::class, 'index'])->name('catalogo.index');
Route::get('/catalogo/{departamento}', [CatalogoController::class, 'show'])->name('catalogo.show');

// Alias para mantener compatibilidad con código existente
Route::get('/departamentos/{id}', [CatalogoController::class, 'show'])->name('departamentos.ver');

// Rutas de autenticación
require __DIR__.'/auth.php';

// Rutas de perfil
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Ruta dashboard por defecto (redirige según el rol)
Route::get('/dashboard', function () {
    $user = Auth::user();
    if ($user->role === 'administrador') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'asesor') {
        return redirect()->route('asesor.dashboard');
    } else {
        return redirect()->route('cliente.dashboard');
    }
})->middleware(['auth'])->name('dashboard');

// Rutas protegidas de cliente
Route::middleware(['auth', 'role:cliente'])->prefix('cliente')->name('cliente.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [ClienteController::class, 'dashboard'])->name('dashboard');
    
    // Perfil
    Route::get('/perfil', [ClienteController::class, 'perfil'])->name('perfil.index');
    Route::patch('/perfil', [ClienteController::class, 'updatePerfil'])->name('perfil.update');
    
    // Solicitudes
    Route::get('/solicitudes', [ClienteController::class, 'solicitudes'])->name('solicitudes.index');
    Route::get('/solicitudes/{id}', [ClienteSolicitudController::class, 'show'])->name('solicitudes.show');
    Route::post('/solicitudes', [ClienteSolicitudController::class, 'store'])->name('solicitudes.store');
    
    // Favoritos
    Route::get('/favoritos', [ClienteDepartamentoController::class, 'favoritos'])->name('favoritos.index');
    Route::post('/favoritos/{departamento_id}', [ClienteDepartamentoController::class, 'agregarFavorito'])->name('favoritos.agregar');
    Route::delete('/favoritos/{departamento_id}', [ClienteDepartamentoController::class, 'eliminarFavorito'])->name('favoritos.eliminar');
    
    // Asesores
    Route::get('/asesores', [ClienteDepartamentoController::class, 'asesores'])->name('asesores.index');
    
    // Cotizaciones
    Route::get('/cotizaciones', [ClienteController::class, 'cotizaciones'])->name('cotizaciones.index');
    
    // Reservas
    Route::get('/reservas', [ClienteController::class, 'reservas'])->name('reservas.index');
    Route::get('/reservas/{id}', [ClienteController::class, 'reservaDetalle'])->name('reservas.show');
    
    // Comentarios en solicitudes
    Route::post('/solicitudes/{id}/comentarios', [ClienteComentarioController::class, 'store'])->name('solicitudes.comentarios.store');
});

// Rutas protegidas de administrador
Route::middleware(['auth', 'role:administrador'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Rutas para departamentos
    Route::prefix('departamentos')->name('departamentos.')->group(function () {
        Route::get('/crear', [AdminDepartamentoController::class, 'create'])->name('create');
        Route::get('/', [AdminDepartamentoController::class, 'index'])->name('index');
        Route::post('/', [AdminDepartamentoController::class, 'store'])->name('store');
        Route::get('/{id}', [AdminDepartamentoController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [AdminDepartamentoController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [AdminDepartamentoController::class, 'update'])->name('update');
        Route::delete('/{id}', [AdminDepartamentoController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/estado', [AdminDepartamentoController::class, 'cambiarEstado'])->name('cambiar-estado');
        Route::patch('/{id}/destacado', [AdminDepartamentoController::class, 'toggleDestacado'])->name('toggle-destacado');
        
        // Rutas para manejo de imágenes
        Route::post('/{id}/imagenes', [AdminDepartamentoController::class, 'subirImagenes'])->name('subir-imagenes');
        Route::delete('/{id}/imagenes/{imagen}', [AdminDepartamentoController::class, 'eliminarImagen'])->name('eliminar-imagen');
        Route::put('/{id}/imagenes/{imagen}/orden', [AdminDepartamentoController::class, 'cambiarOrdenImagen'])->name('cambiar-orden-imagen');
    });
    
    // Rutas para usuarios
    Route::get('/usuarios/crear', [AdminUserController::class, 'create'])->name('usuarios.create');
    Route::resource('usuarios', AdminUserController::class)->except(['create']);
    Route::patch('/usuarios/{id}/estado', [AdminUserController::class, 'cambiarEstado'])->name('usuarios.cambiar-estado');
    
    // Rutas para ventas
    Route::resource('ventas', AdminVentaController::class);
    Route::get('/ventas/{id}/pdf', [AdminVentaController::class, 'generarPDF'])->name('ventas.pdf');
    Route::patch('/ventas/{id}/estado', [AdminVentaController::class, 'cambiarEstado'])->name('ventas.cambiar-estado');
    
    // Rutas para reportes
    Route::get('/reportes', [AdminReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/crear', [AdminReporteController::class, 'create'])->name('reportes.create');
    Route::get('/reportes/{id}', [AdminReporteController::class, 'show'])->name('reportes.show');
    Route::post('/reportes/ventas', [AdminReporteController::class, 'reporteVentas'])->name('reportes.ventas');
    Route::post('/reportes/exportar-excel', [AdminReporteController::class, 'exportarExcel'])->name('reportes.exportar-excel');
    Route::post('/reportes/exportar-pdf', [AdminReporteController::class, 'exportarPdf'])->name('reportes.exportar-pdf');
    
    // Otras rutas de administrador...
});

// Rutas protegidas de asesor
Route::middleware(['auth', 'role:asesor'])->prefix('asesor')->name('asesor.')->group(function () {
    // Dashboard asesor
    Route::get('/dashboard', [AsesorDashboardController::class, 'index'])->name('dashboard');
    
    // Perfil asesor
    Route::get('/perfil', [AsesorPerfilController::class, 'index'])->name('perfil');
    Route::patch('/perfil', [AsesorPerfilController::class, 'update'])->name('perfil.update');
    Route::patch('/password', [AsesorPerfilController::class, 'updatePassword'])->name('password.update');
    
    // Configuración
    Route::get('/configuracion', [AsesorConfiguracionController::class, 'index'])->name('configuracion');
    Route::patch('/configuracion/notificaciones', [AsesorConfiguracionController::class, 'updateNotificaciones'])->name('configuracion.notificaciones');
    Route::patch('/configuracion/horarios', [AsesorConfiguracionController::class, 'updateHorarios'])->name('configuracion.horarios');
    
    // Clientes
    Route::get('/clientes', [AsesorClienteController::class, 'index'])->name('clientes.index');
    Route::get('/clientes/crear', [AsesorClienteController::class, 'create'])->name('clientes.create');
    Route::post('/clientes', [AsesorClienteController::class, 'store'])->name('clientes.store');
    Route::get('/clientes/{id}', [AsesorClienteController::class, 'show'])->name('clientes.show');
    Route::patch('/clientes/{id}', [AsesorClienteController::class, 'update'])->name('clientes.update');
    
    // Solicitudes
    Route::get('/solicitudes', [AsesorSolicitudController::class, 'index'])->name('solicitudes');
    Route::post('/solicitudes/contacto', [AsesorSolicitudController::class, 'registrarContacto'])->name('solicitudes.contacto');
    Route::patch('/solicitudes/{id}/seguimiento', [AsesorSolicitudController::class, 'actualizarSeguimiento'])->name('solicitudes.seguimiento');
    Route::get('/solicitudes/{id}/historial', [AsesorSolicitudController::class, 'historialCliente'])->name('solicitudes.historial');
    Route::post('/solicitudes/{id}/cita', [AsesorSolicitudController::class, 'agendarCita'])->name('solicitudes.cita');
    Route::post('/solicitudes/buscar-departamentos', [AsesorSolicitudController::class, 'buscarDepartamentos'])->name('solicitudes.buscar-departamentos');
    
    // Cotizaciones
    Route::get('/cotizaciones', [AsesorCotizacionController::class, 'index'])->name('cotizaciones');
    Route::get('/cotizaciones/crear/{cliente_id?}', [AsesorCotizacionController::class, 'create'])->name('cotizaciones.crear');
    Route::post('/cotizaciones', [AsesorCotizacionController::class, 'store'])->name('cotizaciones.store');
    Route::get('/cotizaciones/{id}', [AsesorCotizacionController::class, 'show'])->name('cotizaciones.show');
    Route::get('/cotizaciones/{id}/editar', [AsesorCotizacionController::class, 'edit'])->name('cotizaciones.edit');
    Route::patch('/cotizaciones/{id}', [AsesorCotizacionController::class, 'update'])->name('cotizaciones.update');
    Route::delete('/cotizaciones/{id}', [AsesorCotizacionController::class, 'destroy'])->name('cotizaciones.destroy');
    Route::get('/cotizaciones/{id}/pdf', [AsesorCotizacionController::class, 'generarPDF'])->name('cotizaciones.pdf');
    
    // Reservas
    Route::get('/reservas', [AsesorReservaController::class, 'index'])->name('reservas');
    Route::get('/reservas/crear/{cotizacion_id?}', [AsesorReservaController::class, 'create'])->name('reservas.crear');
    Route::post('/reservas', [AsesorReservaController::class, 'store'])->name('reservas.store');
    Route::get('/reservas/{id}', [AsesorReservaController::class, 'show'])->name('reservas.show');
    Route::patch('/reservas/{id}', [AsesorReservaController::class, 'update'])->name('reservas.update');
    Route::patch('/reservas/{id}/estado', [AsesorReservaController::class, 'actualizarEstado'])->name('reservas.actualizar-estado');
    
    // Ventas
    Route::get('/ventas', [AsesorVentaController::class, 'index'])->name('ventas');
    Route::get('/ventas/crear/{reserva_id?}', [AsesorVentaController::class, 'create'])->name('ventas.crear');
    Route::get('/ventas/create/{reserva_id?}', [AsesorVentaController::class, 'create'])->name('ventas.create'); // Alias para compatibilidad
    Route::post('/ventas', [AsesorVentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{id}', [AsesorVentaController::class, 'show'])->name('ventas.show');
    Route::get('/ventas/{id}/editar', [AsesorVentaController::class, 'edit'])->name('ventas.edit');
    Route::patch('/ventas/{id}', [AsesorVentaController::class, 'update'])->name('ventas.update');
    Route::patch('/ventas/{id}/documentos', [AsesorVentaController::class, 'actualizarDocumentos'])->name('ventas.documentos');
    Route::get('/ventas/{id}/pdf', [AsesorVentaController::class, 'generarPDF'])->name('ventas.pdf');
});