<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Historial de Venta #{{ $venta->id }}</title>
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
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
        }
        .header h1 {
            margin: 0;
            color: #2563eb;
            font-size: 24px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            width: 30%;
            padding: 8px;
            background-color: #f3f4f6;
            font-weight: bold;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-value {
            display: table-cell;
            width: 70%;
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .timeline {
            margin-top: 20px;
            border-left: 3px solid #2563eb;
            padding-left: 20px;
        }
        .timeline-item {
            margin-bottom: 25px;
            position: relative;
        }
        .timeline-item:before {
            content: '●';
            position: absolute;
            left: -28px;
            top: 0;
            font-size: 20px;
            color: #2563eb;
        }
        .timeline-header {
            background-color: #eff6ff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 10px;
        }
        .timeline-date {
            font-size: 11px;
            color: #666;
        }
        .timeline-user {
            font-weight: bold;
            color: #2563eb;
        }
        .timeline-action {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 10px;
        }
        .action-creacion {
            background-color: #dcfce7;
            color: #166534;
        }
        .action-edicion {
            background-color: #fef3c7;
            color: #92400e;
        }
        .action-entrega {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .changes-table {
            width: 100%;
            margin-top: 10px;
            font-size: 10px;
            border-collapse: collapse;
        }
        .changes-table th {
            background-color: #f3f4f6;
            padding: 5px;
            text-align: left;
            border: 1px solid #e5e7eb;
        }
        .changes-table td {
            padding: 5px;
            border: 1px solid #e5e7eb;
        }
        .old-value {
            color: #dc2626;
            text-decoration: line-through;
        }
        .new-value {
            color: #16a34a;
            font-weight: bold;
        }
        .motivo-box {
            background-color: #fef3c7;
            padding: 10px;
            border-left: 4px solid #f59e0b;
            margin-top: 10px;
            font-size: 11px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Historial Detallado de Venta</h1>
        <p><strong>Venta #{{ $venta->id }}</strong></p>
        <p>{{ $fechaGeneracion->format('d/m/Y H:i') }}</p>
    </div>

    <!-- Información de la Venta -->
    <div class="section">
        <div class="section-title">INFORMACIÓN DE LA VENTA</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Cliente</div>
                <div class="info-value">{{ $venta->reserva->cotizacion->cliente->usuario->name ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Departamento</div>
                <div class="info-value">{{ $venta->reserva->cotizacion->departamento->codigo ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Fecha de Venta</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Monto Final</div>
                <div class="info-value">S/ {{ number_format((float)$venta->monto_final, 2) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Comisión (3%)</div>
                <div class="info-value">S/ {{ number_format((float)$venta->comision, 2) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Documentos Entregados</div>
                <div class="info-value">{{ $venta->documentos_entregados ? '✓ SÍ' : '✗ NO' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Ediciones Realizadas</div>
                <div class="info-value">{{ $venta->cantidad_ediciones }} de {{ $venta->max_ediciones }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Bloqueada para Edición</div>
                <div class="info-value">{{ $venta->bloqueada_edicion ? 'SÍ' : 'NO' }}</div>
            </div>
        </div>
        @if($venta->observaciones)
        <div style="background-color: #f9fafb; padding: 10px; margin-top: 10px; border-radius: 5px;">
            <strong>Observaciones Actuales:</strong><br>
            {{ $venta->observaciones }}
        </div>
        @endif
    </div>

    <!-- Línea de Tiempo -->
    <div class="section">
        <div class="section-title">LÍNEA DE TIEMPO - HISTORIAL COMPLETO</div>
        <div class="timeline">
            @foreach($historial as $registro)
            <div class="timeline-item">
                <div class="timeline-header">
                    <span class="timeline-date">{{ $registro->created_at->format('d/m/Y H:i:s') }}</span>
                    <span class="timeline-user">{{ $registro->usuario->name }}</span>
                    <span class="timeline-action action-{{ $registro->accion }}">
                        {{ strtoupper(str_replace('_', ' ', $registro->accion)) }}
                    </span>
                </div>

                @if($registro->motivo)
                <div class="motivo-box">
                    <strong>Motivo:</strong> {{ $registro->motivo }}
                </div>
                @endif

                @if($registro->datos_anteriores && $registro->datos_nuevos)
                <table class="changes-table">
                    <thead>
                        <tr>
                            <th>Campo</th>
                            <th>Valor Anterior</th>
                            <th>Valor Nuevo</th>
                        </tr>
                    </thead>
                    <tbody>
                        @php
                            $anteriores = is_string($registro->datos_anteriores) 
                                ? json_decode($registro->datos_anteriores, true) 
                                : $registro->datos_anteriores;
                            $nuevos = is_string($registro->datos_nuevos) 
                                ? json_decode($registro->datos_nuevos, true) 
                                : $registro->datos_nuevos;
                        @endphp
                        
                        @foreach($nuevos as $campo => $valorNuevo)
                            @if(isset($anteriores[$campo]) && $anteriores[$campo] != $valorNuevo)
                            <tr>
                                <td><strong>{{ ucfirst(str_replace('_', ' ', $campo)) }}</strong></td>
                                <td class="old-value">
                                    @if($campo == 'fecha_venta')
                                        {{ \Carbon\Carbon::parse($anteriores[$campo])->format('d/m/Y') }}
                                    @elseif(in_array($campo, ['monto_final', 'comision']))
                                        S/ {{ number_format((float)$anteriores[$campo], 2) }}
                                    @elseif($campo == 'documentos_entregados')
                                        {{ $anteriores[$campo] ? 'SÍ' : 'NO' }}
                                    @else
                                        {{ $anteriores[$campo] ?: 'N/A' }}
                                    @endif
                                </td>
                                <td class="new-value">
                                    @if($campo == 'fecha_venta')
                                        {{ \Carbon\Carbon::parse($valorNuevo)->format('d/m/Y') }}
                                    @elseif(in_array($campo, ['monto_final', 'comision']))
                                        S/ {{ number_format((float)$valorNuevo, 2) }}
                                    @elseif($campo == 'documentos_entregados')
                                        {{ $valorNuevo ? 'SÍ' : 'NO' }}
                                    @else
                                        {{ $valorNuevo ?: 'N/A' }}
                                    @endif
                                </td>
                            </tr>
                            @endif
                        @endforeach
                    </tbody>
                </table>
                @endif

                @if($registro->observaciones)
                <div style="margin-top: 10px; font-size: 10px; color: #666;">
                    <strong>Nota:</strong> {{ $registro->observaciones }}
                </div>
                @endif
            </div>
            @endforeach
        </div>
    </div>

    <div class="footer">
        <p><strong>Inmobiliaria Imperial Cusco</strong></p>
        <p>Documento generado el {{ $fechaGeneracion->format('d/m/Y H:i:s') }}</p>
        <p>Este documento contiene información confidencial y es solo para uso interno</p>
    </div>
</body>
</html>
