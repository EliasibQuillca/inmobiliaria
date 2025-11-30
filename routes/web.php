<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\CatalogoController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\AsesorController as AdminAsesorController;
use App\Http\Controllers\Admin\DepartamentoController as AdminDepartamentoController;
use App\Http\Controllers\Admin\VentaController as AdminVentaController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\ReporteController as AdminReporteController;
use App\Http\Controllers\Admin\PerfilController as AdminPerfilController;
use App\Http\Controllers\Admin\ActividadController as AdminActividadController;
use App\Http\Controllers\Admin\ConfiguracionController as AdminConfiguracionController;
use App\Http\Controllers\Asesor\ConfiguracionController as AsesorConfiguracionController;
use App\Http\Controllers\Asesor\DashboardController as AsesorDashboardController;
use App\Http\Controllers\Asesor\ClienteController as AsesorClienteController;
use App\Http\Controllers\Asesor\CotizacionController as AsesorCotizacionController;
use App\Http\Controllers\Asesor\ReservaController as AsesorReservaController;
use App\Http\Controllers\Asesor\PerfilController as AsesorPerfilController;
use App\Http\Controllers\Asesor\SolicitudController as AsesorSolicitudController;
use App\Http\Controllers\Asesor\VentaController as AsesorVentaController;
use App\Http\Controllers\Cliente\DashboardController as ClienteDashboardController;
use App\Http\Controllers\ClienteDepartamentoController;
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

// Rutas de páginas informativas
Route::get('/sobre-nosotros', [PageController::class, 'sobreNosotros'])->name('sobre-nosotros');
Route::get('/contacto', [PageController::class, 'contacto'])->name('contacto');
Route::post('/contacto/enviar', [PageController::class, 'enviarContacto'])->name('contacto.enviar');

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
        // Cliente tiene su propio dashboard con estadísticas y acceso rápido
        return redirect()->route('cliente.dashboard');
    }
})->middleware(['auth'])->name('dashboard');

// Rutas protegidas de cliente (sistema completo separado)
Route::middleware(['auth', 'active', 'role:cliente'])->prefix('cliente')->name('cliente.')->group(function () {
    // Dashboard del cliente
    Route::get('/dashboard', [ClienteDashboardController::class, 'index'])->name('dashboard');

    // Catálogo exclusivo del cliente (con funcionalidades adicionales)
    Route::get('/catalogo', [ClienteDepartamentoController::class, 'catalogo'])->name('catalogo.index');
    Route::get('/catalogo/{departamento}', [ClienteDepartamentoController::class, 'show'])->name('catalogo.show');

    // Perfil
    Route::get('/perfil', [ClienteController::class, 'perfil'])->name('perfil.index');
    Route::patch('/perfil', [ClienteController::class, 'updatePerfil'])->name('perfil.update');
    Route::patch('/perfil/password', [ClienteController::class, 'updatePassword'])->name('perfil.password');

    // Favoritos
    Route::get('/favoritos', [ClienteDepartamentoController::class, 'favoritos'])->name('favoritos.index');
    Route::post('/favoritos/toggle', [ClienteDepartamentoController::class, 'toggleFavorito'])->name('favoritos.toggle');
    Route::post('/favoritos/{departamento_id}', [ClienteDepartamentoController::class, 'agregarFavorito'])->name('favoritos.agregar');
    Route::delete('/favoritos/{departamento_id}', [ClienteDepartamentoController::class, 'eliminarFavorito'])->name('favoritos.eliminar');

    // Solicitudes (cotizaciones desde la perspectiva del cliente)
    Route::get('/solicitudes', [ClienteSolicitudController::class, 'index'])->name('solicitudes');
    Route::get('/solicitudes/crear', [ClienteSolicitudController::class, 'create'])->name('solicitudes.crear');
    Route::post('/solicitudes', [ClienteSolicitudController::class, 'store'])->name('solicitudes.store');
    Route::get('/solicitudes/{id}', [ClienteSolicitudController::class, 'show'])->name('solicitudes.show');
    Route::patch('/solicitudes/{id}', [ClienteSolicitudController::class, 'update'])->name('solicitudes.update');

    // Acciones del cliente sobre las cotizaciones
    Route::post('/solicitudes/{id}/aceptar', [ClienteSolicitudController::class, 'aceptarCotizacion'])->name('solicitudes.aceptar');
    Route::post('/solicitudes/{id}/rechazar', [ClienteSolicitudController::class, 'rechazarCotizacion'])->name('solicitudes.rechazar');
    Route::post('/solicitudes/{id}/modificar', [ClienteSolicitudController::class, 'solicitarModificacion'])->name('solicitudes.modificar');

    // Comentarios en solicitudes
    Route::post('/solicitudes/{id}/comentarios', [ClienteComentarioController::class, 'store'])->name('solicitudes.comentarios.store');
});

// Rutas protegidas de administrador
Route::middleware(['auth', 'active', 'role:administrador'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Perfil admin
    Route::get('/perfil', [AdminPerfilController::class, 'index'])->name('perfil.index');
    Route::patch('/perfil', [AdminPerfilController::class, 'update'])->name('perfil.update');
    Route::patch('/perfil/password', [AdminPerfilController::class, 'updatePassword'])->name('password.update');

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

        // Exportar a PDF
        Route::post('/exportar-pdf', [AdminDepartamentoController::class, 'exportarPdf'])->name('exportar-pdf');
    });

    // Rutas para usuarios
    Route::get('/usuarios/crear', [AdminUserController::class, 'create'])->name('usuarios.create');
    Route::resource('usuarios', AdminUserController::class)->except(['create']);
    Route::patch('/usuarios/{id}/estado', [AdminUserController::class, 'cambiarEstado'])->name('usuarios.cambiar-estado');

    // Rutas para ventas
    Route::get('/ventas/crear', [AdminVentaController::class, 'create'])->name('ventas.crear');
    Route::resource('ventas', AdminVentaController::class)->except(['create']);
    Route::get('/ventas/{id}/pdf', [AdminVentaController::class, 'generarPDF'])->name('ventas.pdf');
    Route::patch('/ventas/{id}/estado', [AdminVentaController::class, 'cambiarEstado'])->name('ventas.cambiar-estado');

    // Rutas para asesores
    Route::get('/asesores', [AdminAsesorController::class, 'index'])->name('asesores.index');
    Route::get('/asesores/crear', [AdminAsesorController::class, 'create'])->name('asesores.create');
    Route::post('/asesores', [AdminAsesorController::class, 'store'])->name('asesores.store');
    Route::get('/asesores/{id}', [AdminAsesorController::class, 'show'])->name('asesores.show');
    Route::get('/asesores/{id}/editar', [AdminAsesorController::class, 'edit'])->name('asesores.edit');
    Route::patch('/asesores/{id}', [AdminAsesorController::class, 'update'])->name('asesores.update');
    Route::delete('/asesores/{id}', [AdminAsesorController::class, 'destroy'])->name('asesores.destroy');
    Route::patch('/asesores/{id}/estado', [AdminAsesorController::class, 'cambiarEstado'])->name('asesores.cambiar-estado');

    // Rutas para reportes
    Route::get('/reportes', [AdminReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/crear', [AdminReporteController::class, 'create'])->name('reportes.create');
    Route::get('/reportes/{id}', [AdminReporteController::class, 'show'])->name('reportes.show');
    Route::post('/reportes/ventas', [AdminReporteController::class, 'reporteVentas'])->name('reportes.ventas');
    Route::post('/reportes/exportar-excel', [AdminReporteController::class, 'exportarExcel'])->name('reportes.exportar-excel');
    Route::post('/reportes/exportar-pdf', [AdminReporteController::class, 'exportarPdf'])->name('reportes.exportar-pdf');

    // Rutas para actividades/auditoría
    Route::get('/actividades', [AdminActividadController::class, 'index'])->name('actividades.index');

    // Configuración del sistema
    Route::get('/configuracion', [AdminConfiguracionController::class, 'index'])->name('configuracion.index');
    Route::patch('/configuracion', [AdminConfiguracionController::class, 'update'])->name('configuracion.update');

    // Otras rutas de administrador...
});

// Rutas protegidas de asesor
Route::middleware(['auth', 'active', 'role:asesor'])->prefix('asesor')->name('asesor.')->group(function () {
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
    Route::get('/solicitudes/detalle', [AsesorSolicitudController::class, 'verDetalleQuery'])->name('solicitudes.detalle.query');
    Route::get('/solicitudes/{id}/detalle', [AsesorSolicitudController::class, 'verDetalle'])->name('solicitudes.detalle');
    Route::patch('/solicitudes/{id}/estado', [AsesorSolicitudController::class, 'actualizarEstado'])->name('solicitudes.estado');
    Route::post('/solicitudes/{id}/responder', [AsesorSolicitudController::class, 'responderSolicitud'])->name('solicitudes.responder');
    Route::patch('/solicitudes/{id}/seguimiento', [AsesorSolicitudController::class, 'actualizarSeguimiento'])->name('solicitudes.seguimiento');
    Route::get('/solicitudes/{id}/historial', [AsesorSolicitudController::class, 'historialCliente'])->name('solicitudes.historial');
    Route::post('/solicitudes/{id}/cita', [AsesorSolicitudController::class, 'agendarCita'])->name('solicitudes.cita');
    Route::post('/solicitudes/buscar-departamentos', [AsesorSolicitudController::class, 'buscarDepartamentos'])->name('solicitudes.buscar-departamentos');

    // Cotizaciones
    Route::get('/cotizaciones', [AsesorCotizacionController::class, 'index'])->name('cotizaciones');
    Route::get('/cotizaciones/crear', [AsesorCotizacionController::class, 'create'])->name('cotizaciones.crear');
    Route::get('/cotizaciones/create', [AsesorCotizacionController::class, 'create'])->name('cotizaciones.create'); // Alias en inglés
    Route::post('/cotizaciones', [AsesorCotizacionController::class, 'store'])->name('cotizaciones.store');
    Route::get('/cotizaciones/{id}', [AsesorCotizacionController::class, 'show'])->name('cotizaciones.show');
    Route::get('/cotizaciones/{id}/editar', [AsesorCotizacionController::class, 'edit'])->name('cotizaciones.edit');
    Route::patch('/cotizaciones/{id}', [AsesorCotizacionController::class, 'update'])->name('cotizaciones.update');
    Route::patch('/cotizaciones/{id}/estado', [AsesorCotizacionController::class, 'actualizarEstado'])->name('cotizaciones.actualizar-estado');
    Route::delete('/cotizaciones/{id}', [AsesorCotizacionController::class, 'destroy'])->name('cotizaciones.destroy');
    Route::get('/cotizaciones/{id}/pdf', [AsesorCotizacionController::class, 'generarPDF'])->name('cotizaciones.pdf');

    // Reservas
    Route::get('/reservas', [AsesorReservaController::class, 'index'])->name('reservas');
    Route::get('/reservas/crear/{cotizacion_id?}', [AsesorReservaController::class, 'create'])->name('reservas.crear');
    Route::post('/reservas', [AsesorReservaController::class, 'store'])->name('reservas.store');
    Route::get('/reservas/{id}', [AsesorReservaController::class, 'show'])->name('reservas.show');
    Route::patch('/reservas/{id}', [AsesorReservaController::class, 'update'])->name('reservas.update');
    Route::patch('/reservas/{id}/confirmar', [AsesorReservaController::class, 'confirmar'])->name('reservas.confirmar');
    Route::patch('/reservas/{id}/cancelar', [AsesorReservaController::class, 'cancelar'])->name('reservas.cancelar');
    Route::patch('/reservas/{id}/revertir', [AsesorReservaController::class, 'revertir'])->name('reservas.revertir');

    // Ventas
    Route::get('/ventas', [AsesorVentaController::class, 'index'])->name('ventas.index');
    Route::get('/ventas/create', [AsesorVentaController::class, 'create'])->name('ventas.create');
    Route::post('/ventas', [AsesorVentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{venta}', [AsesorVentaController::class, 'show'])->name('ventas.show');
    Route::get('/ventas/{venta}/edit', [AsesorVentaController::class, 'edit'])->name('ventas.edit');
    Route::patch('/ventas/{venta}', [AsesorVentaController::class, 'update'])->name('ventas.update');
    Route::patch('/ventas/{venta}/entregar-documentos', [AsesorVentaController::class, 'marcarDocumentosEntregados'])->name('ventas.entregar-documentos');
    Route::get('/ventas/{venta}/pdf', [AsesorVentaController::class, 'generarPDF'])->name('ventas.pdf');
});
