<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\CatalogoController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\DashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aquí están las rutas web del sistema inmobiliario. Estas rutas cargan
| las vistas principales para cada tipo de usuario.
|
*/

// Rutas públicas
Route::get('/', [CatalogoController::class, 'home'])->name('home');
Route::get('/catalogo', [CatalogoController::class, 'index'])->name('catalogo');
Route::get('/departamento/{id}', [CatalogoController::class, 'show'])->name('departamento.detalle');
Route::post('/contacto', [CatalogoController::class, 'contacto'])->name('contacto');

// Rutas de autenticación
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rutas protegidas
Route::middleware(['auth'])->group(function () {
    // Dashboard principal (redirige según el rol)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perfil de usuario
    Route::get('/profile', [DashboardController::class, 'profile'])->name('profile');
    Route::patch('/profile', [DashboardController::class, 'updateProfile'])->name('profile.update');

    // Rutas para Asesores
    Route::middleware(['role:asesor,administrador'])->prefix('asesor')->name('asesor.')->group(function () {
        Route::get('/clientes', [DashboardController::class, 'clientes'])->name('clientes');
        Route::get('/cotizaciones', [DashboardController::class, 'cotizaciones'])->name('cotizaciones');
        Route::get('/reservas', [DashboardController::class, 'reservas'])->name('reservas');
        Route::get('/ventas', [DashboardController::class, 'ventas'])->name('ventas');
    });

    // Rutas para Administradores
    Route::middleware(['role:administrador'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/usuarios', [DashboardController::class, 'usuarios'])->name('usuarios');
        Route::get('/departamentos', [DashboardController::class, 'departamentos'])->name('departamentos');
        Route::get('/reportes', [DashboardController::class, 'reportes'])->name('reportes');
    });
});
