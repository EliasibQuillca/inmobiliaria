<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Mis Clientes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #7c3aed;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #7c3aed;
            font-size: 24px;
        }
        .info-box {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .stats {
            display: table;
            width: 100%;
            margin-bottom: 20px;
        }
        .stat-item {
            display: table-cell;
            width: 33.33%;
            text-align: center;
            padding: 15px;
            background-color: #e5e7eb;
            border-radius: 5px;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #7c3aed;
        }
        .stat-label {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        .cliente-card {
            border: 1px solid #e5e7eb;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #fafafa;
        }
        .cliente-header {
            display: table;
            width: 100%;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .cliente-nombre {
            display: table-cell;
            font-size: 14px;
            font-weight: bold;
            color: #7c3aed;
        }
        .cliente-stats {
            display: table-cell;
            text-align: right;
            font-size: 10px;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            margin-left: 5px;
        }
        .badge-compra {
            background-color: #dcfce7;
            color: #166534;
        }
        .badge-activo {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .badge-inactivo {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .cliente-info {
            display: table;
            width: 100%;
            margin-top: 10px;
        }
        .cliente-info-row {
            display: table-row;
        }
        .cliente-info-label {
            display: table-cell;
            width: 25%;
            padding: 5px;
            font-size: 10px;
            color: #666;
        }
        .cliente-info-value {
            display: table-cell;
            width: 25%;
            padding: 5px;
            font-size: 10px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>👥 Reporte de Mis Clientes</h1>
        <p><strong>Asesor:</strong> {{ $asesor->usuario->name }}</p>
        <p><strong>Fecha de Generación:</strong> {{ $fechaGeneracion->format('d/m/Y H:i') }}</p>
    </div>

    <div class="info-box">
        <strong>Asesor:</strong> {{ $asesor->usuario->name }}<br>
        <strong>Email:</strong> {{ $asesor->usuario->email }}<br>
        <strong>Teléfono:</strong> {{ $asesor->telefono ?? 'No especificado' }}
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value">{{ $totalClientes }}</div>
            <div class="stat-label">Total Clientes</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{{ $clientesConCompra }}</div>
            <div class="stat-label">Con Compra</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">{{ $clientesActivos }}</div>
            <div class="stat-label">Activos</div>
        </div>
    </div>

    <h3 style="color: #7c3aed; margin-top: 30px;">Detalle de Clientes</h3>

    @if($clientes->count() > 0)
        @foreach($clientes as $cliente)
        <div class="cliente-card">
            <div class="cliente-header">
                <div class="cliente-nombre">
                    {{ $cliente->usuario->name ?? $cliente->nombre }}
                    @if($cliente->total_compras > 0)
                        <span class="badge badge-compra">{{ $cliente->total_compras }} COMPRA(S)</span>
                    @endif
                    @if($cliente->total_cotizaciones > 0)
                        <span class="badge badge-activo">ACTIVO</span>
                    @else
                        <span class="badge badge-inactivo">INACTIVO</span>
                    @endif
                </div>
                <div class="cliente-stats">
                    <strong>Cliente desde:</strong> {{ \Carbon\Carbon::parse($cliente->created_at)->format('d/m/Y') }}
                </div>
            </div>

            <div class="cliente-info">
                <div class="cliente-info-row">
                    <div class="cliente-info-label">📧 Email:</div>
                    <div class="cliente-info-value">{{ $cliente->usuario->email ?? 'N/A' }}</div>
                    <div class="cliente-info-label">📱 Teléfono:</div>
                    <div class="cliente-info-value">{{ $cliente->usuario->telefono ?? 'N/A' }}</div>
                </div>
                <div class="cliente-info-row">
                    <div class="cliente-info-label">🆔 DNI:</div>
                    <div class="cliente-info-value">{{ $cliente->dni ?? 'N/A' }}</div>
                    <div class="cliente-info-label">📍 Dirección:</div>
                    <div class="cliente-info-value">{{ $cliente->direccion ?? 'N/A' }}</div>
                </div>
                <div class="cliente-info-row">
                    <div class="cliente-info-label">💬 Cotizaciones:</div>
                    <div class="cliente-info-value">{{ $cliente->total_cotizaciones }}</div>
                    <div class="cliente-info-label">✓ Aceptadas:</div>
                    <div class="cliente-info-value">{{ $cliente->cotizaciones_aceptadas }}</div>
                </div>
                <div class="cliente-info-row">
                    <div class="cliente-info-label">🏡 Compras:</div>
                    <div class="cliente-info-value">{{ $cliente->total_compras }}</div>
                    <div class="cliente-info-label">💰 Total Comprado:</div>
                    <div class="cliente-info-value">S/ {{ number_format((float)$cliente->monto_total_comprado, 2) }}</div>
                </div>
                <div class="cliente-info-row">
                    <div class="cliente-info-label">🕐 Última Actividad:</div>
                    <div class="cliente-info-value" colspan="3">
                        {{ \Carbon\Carbon::parse($cliente->ultima_actividad)->format('d/m/Y H:i') }}
                        ({{ \Carbon\Carbon::parse($cliente->ultima_actividad)->diffForHumans() }})
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    @else
        <p style="text-align: center; padding: 40px; color: #999;">
            No hay clientes asignados
        </p>
    @endif

    <div class="footer">
        <p><strong>Inmobiliaria Imperial Cusco</strong></p>
        <p>Documento generado el {{ $fechaGeneracion->format('d/m/Y H:i:s') }}</p>
        <p>Este documento contiene información confidencial</p>
    </div>
</body>
</html>
