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

/*
|--------------------------------------------------------------------------
| RUTAS DE PRUEBA TEMPORAL
|--------------------------------------------------------------------------
*/
Route::get('/test-login', function () {
    return view('test-login');
})->name('test.login.form');

Route::post('/test-login', function () {
    $credentials = request()->only('email', 'password');

    if (Auth::attempt($credentials)) {
        request()->session()->regenerate();
        return redirect()->back()->with('success', 'Login exitoso!');
    }

    return redirect()->back()->with('error', 'Credenciales incorrectas');
})->name('test.login');

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/

// Página de inicio - redirige al catálogo público
Route::get('/', function () {
    return redirect()->route('catalogo.index');
});

// Catálogo público de propiedades
Route::get('/catalogo', [CatalogoController::class, 'index'])->name('catalogo.index');
Route::get('/catalogo/{departamento}', [CatalogoController::class, 'show'])->name('catalogo.show');
Route::post('/catalogo/contacto', [CatalogoController::class, 'solicitudContacto'])->name('catalogo.contacto');
Route::post('/catalogo/registro-rapido', [CatalogoController::class, 'registroRapido'])->name('catalogo.registro');

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
    $user = Auth::user();

    if (!$user) {
        return redirect()->route('login');
    }

    // Redirigir según el rol del usuario
    switch ($user->role) {
        case 'administrador':
            return redirect()->route('admin.dashboard');
        case 'asesor':
            return redirect()->route('asesor.dashboard');
        case 'cliente':
            return redirect()->route('cliente.dashboard');
        default:
            // Dashboard por defecto si no tiene rol específico
            return Inertia::render('Dashboard');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| RUTAS PARA CLIENTE
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:cliente'])->prefix('cliente')->name('cliente.')->group(function () {
    // === DASHBOARD PRINCIPAL ===
    Route::get('/dashboard', [ClienteController::class, 'dashboard'])->name('dashboard');
    
    // === RUTA DE PRUEBA ===
    Route::get('/test', function () {
        return inertia('Cliente/Test');
    })->name('test');

    // === FAVORITOS ===
    Route::get('/favoritos', [ClienteDepartamentoController::class, 'favoritos'])->name('favoritos.index');
    Route::post('/favoritos/toggle', [ClienteDepartamentoController::class, 'toggleFavorito'])->name('favoritos.toggle');

    // === SOLICITUDES ===
    Route::get('/solicitudes', [ClienteController::class, 'solicitudes'])->name('solicitudes.index');
    Route::get('/solicitudes/crear', [ClienteSolicitudController::class, 'create'])->name('solicitudes.create');
    Route::post('/solicitudes', [ClienteSolicitudController::class, 'store'])->name('solicitudes.store');
    
    // === COTIZACIONES Y RESERVAS ===
    Route::get('/cotizaciones', [ClienteController::class, 'cotizaciones'])->name('cotizaciones.index');
    Route::get('/reservas', [ClienteController::class, 'reservas'])->name('reservas.index');
    
    // === COMENTARIOS Y CHAT ===
    Route::get('/solicitudes/{cotizacion}/comentarios', [ClienteComentarioController::class, 'show'])->name('solicitudes.comentarios');
    Route::post('/solicitudes/{cotizacion}/comentarios', [ClienteComentarioController::class, 'store'])->name('solicitudes.comentarios.store');
    Route::get('/comentarios/no-leidos', [ClienteComentarioController::class, 'contarNoLeidos'])->name('comentarios.no-leidos');
    Route::post('/comentarios/marcar-leidos', [ClienteComentarioController::class, 'marcarTodosLeidos'])->name('comentarios.marcar-leidos');

    // === ASESORES ===
    Route::get('/asesores', [ClienteDashboardController::class, 'asesores'])->name('asesores');

    // === PERFIL ===
    Route::get('/perfil', [ClienteController::class, 'perfil'])->name('perfil.index');
    Route::patch('/perfil', [ClienteController::class, 'updatePerfil'])->name('perfil.update');

    // === CATÁLOGO - REDIRIGE AL PÚBLICO ===
    Route::get('/catalogo', function () {
        return redirect()->route('catalogo.index');
    })->name('catalogo');
});

/*
|--------------------------------------------------------------------------
| RUTAS PARA ASESOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:asesor'])->prefix('asesor')->name('asesor.')->group(function () {
    // Dashboard del asesor
    Route::get('/dashboard', [AsesorDashboardController::class, 'index'])->name('dashboard');

    // === PERFIL ===
    Route::get('/perfil', [AsesorPerfilController::class, 'index'])->name('perfil');
    Route::patch('/perfil', [AsesorPerfilController::class, 'update'])->name('perfil.update');
    Route::patch('/perfil/password', [AsesorPerfilController::class, 'updatePassword'])->name('perfil.password.update');

    // === GESTIÓN DE CLIENTES ===
    Route::resource('clientes', AsesorClienteController::class);

    // === SOLICITUDES DE CONTACTO ===
    Route::get('/solicitudes', [AsesorSolicitudController::class, 'index'])->name('solicitudes');
    Route::post('/solicitudes/contacto', [AsesorSolicitudController::class, 'registrarContacto'])->name('solicitudes.contacto');
    Route::patch('/solicitudes/{cliente}/seguimiento', [AsesorSolicitudController::class, 'actualizarSeguimiento'])->name('solicitudes.seguimiento');
    Route::get('/solicitudes/{cliente}/historial', [AsesorSolicitudController::class, 'historialCliente'])->name('solicitudes.historial');
    Route::post('/solicitudes/{cliente}/cita', [AsesorSolicitudController::class, 'agendarCita'])->name('solicitudes.cita');
    Route::get('/solicitudes/buscar-departamentos', [AsesorSolicitudController::class, 'buscarDepartamentos'])->name('solicitudes.buscar');

    // === COTIZACIONES ===
    Route::get('/cotizaciones', [AsesorCotizacionController::class, 'index'])->name('cotizaciones');
    Route::get('/cotizaciones/create', [AsesorCotizacionController::class, 'create'])->name('cotizaciones.create');
    Route::post('/cotizaciones', [AsesorCotizacionController::class, 'store'])->name('cotizaciones.store');
    Route::patch('/cotizaciones/{cotizacion}/estado', [AsesorCotizacionController::class, 'updateEstado'])->name('cotizaciones.estado');
    Route::get('/cotizaciones/{cotizacion}/edit', [AsesorCotizacionController::class, 'edit'])->name('cotizaciones.edit');
    Route::patch('/cotizaciones/{cotizacion}', [AsesorCotizacionController::class, 'update'])->name('cotizaciones.update');

    // === RESERVAS ===
    Route::get('/reservas', [AsesorReservaController::class, 'index'])->name('reservas');
    Route::get('/reservas/crear', [AsesorReservaController::class, 'create'])->name('reservas.create');
    Route::post('/reservas', [AsesorReservaController::class, 'store'])->name('reservas.store');
    Route::patch('/reservas/{reserva}/confirmar', [AsesorReservaController::class, 'confirmar'])->name('reservas.confirmar');
    Route::patch('/reservas/{reserva}/cancelar', [AsesorReservaController::class, 'cancelar'])->name('reservas.cancelar');
    Route::patch('/reservas/{reserva}/revertir', [AsesorReservaController::class, 'revertir'])->name('reservas.revertir');
    Route::patch('/reservas/{reserva}', [AsesorReservaController::class, 'update'])->name('reservas.update');

    // === VENTAS ===
    Route::get('/ventas', [AsesorVentaController::class, 'index'])->name('ventas');
    Route::get('/ventas/create', [AsesorVentaController::class, 'create'])->name('ventas.create');
    Route::post('/ventas', [AsesorVentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{venta}', [AsesorVentaController::class, 'show'])->name('ventas.show');
    Route::get('/ventas/{venta}/edit', [AsesorVentaController::class, 'edit'])->name('ventas.edit');
    Route::patch('/ventas/{venta}', [AsesorVentaController::class, 'update'])->name('ventas.update');
    Route::patch('/ventas/{venta}/documentos', [AsesorVentaController::class, 'actualizarDocumentos'])->name('ventas.documentos');
});

/*
|--------------------------------------------------------------------------
| RUTAS PARA ADMINISTRADOR
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'role:administrador'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard del administrador
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::get('/estadisticas', [AdminDashboardController::class, 'estadisticas'])->name('estadisticas');

    // === GESTIÓN DE USUARIOS ===
    Route::get('/usuarios', [AdminUserController::class, 'index'])->name('usuarios');
    Route::get('/usuarios/crear', [AdminUserController::class, 'create'])->name('usuarios.crear');
    Route::post('/usuarios', [AdminUserController::class, 'store'])->name('usuarios.store');
    Route::get('/usuarios/{id}/editar', [AdminUserController::class, 'edit'])->name('usuarios.editar');
    Route::put('/usuarios/{id}', [AdminUserController::class, 'update'])->name('usuarios.update');

    // Rutas para operaciones CRUD
    Route::patch('/usuarios/{id}/estado', [AdminUserController::class, 'cambiarEstado'])->name('usuarios.cambiar-estado');
    Route::delete('/usuarios/{id}', [AdminUserController::class, 'destroy'])->name('usuarios.eliminar');

    // === GESTIÓN DE ASESORES ===
    Route::get('/asesores', [AdminAsesorController::class, 'index'])->name('asesores');
    Route::get('/asesores/crear', [AdminAsesorController::class, 'create'])->name('asesores.crear');
    Route::post('/asesores', [AdminAsesorController::class, 'store'])->name('asesores.store');
    Route::get('/asesores/{id}', [AdminAsesorController::class, 'show'])->name('asesores.ver');
    Route::get('/asesores/{id}/editar', [AdminAsesorController::class, 'edit'])->name('asesores.editar');
    Route::put('/asesores/{id}', [AdminAsesorController::class, 'update'])->name('asesores.update');
    Route::patch('/asesores/{id}/estado', [AdminAsesorController::class, 'cambiarEstado'])->name('asesores.cambiar-estado');
    Route::delete('/asesores/{id}', [AdminAsesorController::class, 'destroy'])->name('asesores.eliminar');

    // === GESTIÓN DE DEPARTAMENTOS ===
    Route::get('/departamentos', [AdminDepartamentoController::class, 'index'])->name('departamentos');

    Route::get('/departamentos/crear', [AdminDepartamentoController::class, 'create'])->name('departamentos.crear');
    Route::post('/departamentos', [AdminDepartamentoController::class, 'store'])->name('departamentos.store');

    Route::get('/departamentos/{id}', [AdminDepartamentoController::class, 'show'])->name('departamentos.ver');

    Route::get('/departamentos/{id}/editar', [AdminDepartamentoController::class, 'edit'])->name('departamentos.editar');
    Route::put('/departamentos/{id}', [AdminDepartamentoController::class, 'update'])->name('departamentos.update');

    // Rutas para operaciones específicas
    Route::patch('/departamentos/{id}/estado', [AdminDepartamentoController::class, 'cambiarEstado'])->name('departamentos.cambiar-estado');
    Route::patch('/departamentos/{id}/destacado', [AdminDepartamentoController::class, 'toggleDestacado'])->name('departamentos.toggle-destacado');
    Route::delete('/departamentos/{id}', [AdminDepartamentoController::class, 'destroy'])->name('departamentos.eliminar');

    // Ruta para exportar
    Route::get('/departamentos/exportar', [AdminDepartamentoController::class, 'exportar'])->name('departamentos.exportar');

    // Rutas para gestión de imágenes
    Route::post('/departamentos/{id}/imagenes', [AdminDepartamentoController::class, 'subirImagenes'])->name('departamentos.subir-imagenes');
    Route::delete('/departamentos/{id}/imagenes/{imagenId}', [AdminDepartamentoController::class, 'eliminarImagen'])->name('departamentos.eliminar-imagen');

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
    Route::get('/ventas', [AdminVentaController::class, 'index'])->name('ventas');
    Route::get('/ventas/crear', [AdminVentaController::class, 'create'])->name('ventas.crear');
    Route::post('/ventas', [AdminVentaController::class, 'store'])->name('ventas.store');
    Route::get('/ventas/{id}', [AdminVentaController::class, 'show'])->name('ventas.ver');
    Route::get('/ventas/{id}/edit', [AdminVentaController::class, 'edit'])->name('ventas.editar');
    Route::put('/ventas/{id}', [AdminVentaController::class, 'update'])->name('ventas.update');
    Route::post('/ventas/reporte', [AdminVentaController::class, 'generarReporte'])->name('ventas.reporte');
    Route::delete('/ventas/{id}/cancelar', [AdminVentaController::class, 'cancelar'])->name('ventas.cancelar');

    // === REPORTES ===
    Route::get('/reportes', [AdminReporteController::class, 'index'])->name('reportes');

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
        Route::get('/buscar', [ClienteDepartamentoController::class, 'search'])->name('search');
        Route::get('/favoritos', [ClienteDepartamentoController::class, 'getFavoritos'])->name('favoritos');
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
        Route::get('/dashboard', [AsesorDashboardController::class, 'getEstadisticas'])->name('dashboard');
        Route::get('/comisiones', [AsesorConfiguracionController::class, 'getComisiones'])->name('comisiones');
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
        Route::get('/ventas', [AdminReporteController::class, 'reporteVentas'])->name('ventas');
        Route::get('/asesores', [AdminReporteController::class, 'reporteAsesores'])->name('asesores');
        Route::get('/propiedades', [AdminReporteController::class, 'reportePropiedades'])->name('propiedades');
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
