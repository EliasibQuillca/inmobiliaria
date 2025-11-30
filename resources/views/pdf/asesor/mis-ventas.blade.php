<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Mis Ventas</title>
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
            border-bottom: 3px solid #16a34a;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #16a34a;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .info-box {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .info-box table {
            width: 100%;
        }
        .info-box td {
            padding: 5px;
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
        .stat-item:nth-child(2) {
            margin: 0 10px;
        }
        .stat-value {
            font-size: 20px;
            font-weight: bold;
            color: #16a34a;
        }
        .stat-label {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
        }
        table.ventas {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        table.ventas th {
            background-color: #16a34a;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
        }
        table.ventas td {
            border-bottom: 1px solid #e5e7eb;
            padding: 8px;
            font-size: 10px;
        }
        table.ventas tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .badge {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-success {
            background-color: #dcfce7;
            color: #166534;
        }
        .badge-warning {
            background-color: #fef3c7;
            color: #92400e;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .money {
            text-align: right;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Reporte de Mis Ventas</h1>
        <p><strong>Asesor:</strong> {{ $asesor->usuario->name }}</p>
        <p><strong>Período:</strong> {{ $periodo }}</p>
        <p><strong>Fecha de Generación:</strong> {{ $fechaGeneracion->format('d/m/Y H:i') }}</p>
    </div>

    <div class="info-box">
        <table>
            <tr>
                <td><strong>Asesor:</strong></td>
                <td>{{ $asesor->usuario->name }}</td>
                <td><strong>Email:</strong></td>
                <td>{{ $asesor->usuario->email }}</td>
            </tr>
            <tr>
                <td><strong>Teléfono:</strong></td>
                <td>{{ $asesor->telefono ?? 'No especificado' }}</td>
                <td><strong>Especialidad:</strong></td>
                <td>{{ $asesor->especialidad ?? 'General' }}</td>
            </tr>
        </table>
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value">{{ $totalVentas }}</div>
            <div class="stat-label">Total Ventas</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">S/ {{ number_format((float)$totalMonto, 2) }}</div>
            <div class="stat-label">Monto Total</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">S/ {{ number_format((float)$totalComisiones, 2) }}</div>
            <div class="stat-label">Comisiones (3%)</div>
        </div>
    </div>

    <h3 style="color: #16a34a; margin-top: 30px;">Detalle de Ventas</h3>

    @if($ventas->count() > 0)
        <table class="ventas">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Departamento</th>
                    <th class="money">Monto Final</th>
                    <th class="money">Comisión</th>
                    <th style="text-align: center;">Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($ventas as $venta)
                <tr>
                    <td>#{{ $venta->id }}</td>
                    <td>{{ \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y') }}</td>
                    <td>{{ $venta->reserva->cotizacion->cliente->usuario->name ?? 'N/A' }}</td>
                    <td>{{ $venta->reserva->cotizacion->departamento->codigo ?? 'N/A' }}</td>
                    <td class="money">S/ {{ number_format((float)$venta->monto_final, 2) }}</td>
                    <td class="money">S/ {{ number_format((float)$venta->comision, 2) }}</td>
                    <td style="text-align: center;">
                        <span class="badge {{ $venta->documentos_entregados ? 'badge-success' : 'badge-warning' }}">
                            {{ $venta->documentos_entregados ? 'ENTREGADOS' : 'PENDIENTE' }}
                        </span>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p style="text-align: center; padding: 40px; color: #999;">
            No hay ventas registradas en este período
        </p>
    @endif

    <div class="footer">
        <p><strong>Inmobiliaria Imperial Cusco</strong></p>
        <p>Documento generado automáticamente el {{ $fechaGeneracion->format('d/m/Y H:i:s') }}</p>
        <p>Este documento es un reporte interno del sistema</p>
    </div>
</body>
</html>
