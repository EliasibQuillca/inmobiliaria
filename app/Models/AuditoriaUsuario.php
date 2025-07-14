<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditoriaUsuario extends Model
{
    use HasFactory;

    protected $table = 'auditoria_usuarios';

    protected $fillable = [
        'usuario_id',
        'accion',
        'detalles',
        'fecha_hora',
    ];

    protected $casts = [
        'detalles' => 'array',
        'fecha_hora' => 'datetime',
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    // Métodos estáticos para registro de auditoría
    public static function registrar($usuarioId, $accion, $detalles = null)
    {
        return self::create([
            'usuario_id' => $usuarioId,
            'accion' => $accion,
            'detalles' => $detalles,
            'fecha_hora' => now(),
        ]);
    }

    public static function registrarLogin($usuarioId)
    {
        return self::registrar($usuarioId, 'login', [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public static function registrarLogout($usuarioId)
    {
        return self::registrar($usuarioId, 'logout');
    }

    public static function registrarCreacionCotizacion($usuarioId, $cotizacionId)
    {
        return self::registrar($usuarioId, 'creacion_cotizacion', [
            'cotizacion_id' => $cotizacionId,
        ]);
    }

    public static function registrarCreacionReserva($usuarioId, $reservaId)
    {
        return self::registrar($usuarioId, 'creacion_reserva', [
            'reserva_id' => $reservaId,
        ]);
    }

    public static function registrarVenta($usuarioId, $ventaId)
    {
        return self::registrar($usuarioId, 'registro_venta', [
            'venta_id' => $ventaId,
        ]);
    }
}
