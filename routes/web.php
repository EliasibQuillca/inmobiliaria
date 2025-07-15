<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Todas las rutas web ahora sirven la aplicación React SPA.
| La autenticación y navegación se maneja completamente en el frontend
| a través de las APIs REST.
|
*/

// Ruta principal que sirve la aplicación React SPA
Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*')->name('spa');

// Si necesitas rutas específicas que no sean SPA, descomenta y ajusta:
// Route::get('/api/docs', function () {
//     return view('api-docs');
// })->name('api.docs');
