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
    Route::resource('departamentos', AdminDepartamentoController::class);
    Route::patch('/departamentos/{id}/estado', [AdminDepartamentoController::class, 'cambiarEstado'])->name('departamentos.cambiar-estado');
    Route::patch('/departamentos/{id}/destacado', [AdminDepartamentoController::class, 'toggleDestacado'])->name('departamentos.toggle-destacado');
    
    // Otras rutas de administrador...
});