<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\Asesor;
use App\Models\Cotizacion;
use App\Models\Reserva;
use App\Policies\AsesorPolicy;
use App\Policies\CotizacionPolicy;
use App\Policies\ReservaPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Asesor::class => AsesorPolicy::class,
        Cotizacion::class => CotizacionPolicy::class,
        Reserva::class => ReservaPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Definir roles
        Gate::define('administrador', function (User $user) {
            return $user->esAdministrador();
        });

        Gate::define('asesor', function (User $user) {
            return $user->esAsesor();
        });

        Gate::define('cliente', function (User $user) {
            return $user->esCliente();
        });
    }
}
