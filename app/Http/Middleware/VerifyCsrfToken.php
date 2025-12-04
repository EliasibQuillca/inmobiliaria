<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        //
    ];

    /**
     * Determine if the request has a URI that should pass through CSRF verification.
     */
    protected function inExceptArray($request)
    {
        // Excluir logout completamente de CSRF
        if ($request->is('logout') || $request->fullUrlIs('*/logout')) {
            return true;
        }

        return parent::inExceptArray($request);
    }

    /**
     * Determine if the session and input CSRF tokens match.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return bool
     */
    protected function tokensMatch($request)
    {
        // Deshabilitar CSRF verification en modo testing
        if (app()->environment('testing')) {
            return true;
        }

        // Deshabilitar CSRF para logout (última capa de protección)
        if ($request->is('logout')) {
            return true;
        }

        return parent::tokensMatch($request);
    }
}
