<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    public function actingAs($user, $driver = null)
    {
        // Si es autenticación Sanctum
        if ($driver === 'sanctum' && method_exists($user, 'createToken')) {
            // Laravel Sanctum entiende este contexto automáticamente
            return parent::actingAs($user, 'sanctum');
        }

        // Autenticación normal
        return parent::actingAs($user, $driver);
    }
}
