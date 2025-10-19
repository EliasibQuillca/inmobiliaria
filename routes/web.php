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

// Rutas públicas
Route::get('/', function () {
    return redirect()->route('catalogo.index');
});

// Rutas de catálogo
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
        return redirect()->route('catalogo.index');
    }
})->middleware(['auth'])->name('dashboard');

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
        Route::put('/{id}', [AdminDepartamentoController::class, 'update'])->name('update');
        Route::delete('/{id}', [AdminDepartamentoController::class, 'destroy'])->name('destroy');
        Route::patch('/{id}/estado', [AdminDepartamentoController::class, 'cambiarEstado'])->name('cambiar-estado');
        Route::patch('/{id}/destacado', [AdminDepartamentoController::class, 'toggleDestacado'])->name('toggle-destacado');
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