<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $tipo }} - Reporte</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #4f46e5;
            margin: 0 0 10px 0;
            font-size: 24px;
        }

        .header p {
            margin: 5px 0;
            color: #666;
        }

        .summary {
            margin-bottom: 30px;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
        }

        .summary h2 {
            color: #374151;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .summary-item {
            background-color: white;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #4f46e5;
        }

        .summary-item .label {
            font-weight: bold;
            color: #374151;
            display: block;
            margin-bottom: 5px;
        }

        .summary-item .value {
            font-size: 18px;
            color: #4f46e5;
            font-weight: bold;
        }

        .data-section {
            margin-top: 30px;
        }

        .data-section h3 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background-color: white;
        }

        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }

        th {
            background-color: #f9fafb;
            font-weight: bold;
            color: #374151;
        }

        tr:nth-child(even) {
            background-color: #f9fafb;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
        }

        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de {{ $tipo }}</h1>
        @if($fechaInicio && $fechaFin)
            <p><strong>Período:</strong> {{ $fechaInicio }} - {{ $fechaFin }}</p>
        @endif
        <p><strong>Generado el:</strong> {{ $fecha_generacion }}</p>
    </div>

    {{-- Resumen ejecutivo (solo para reportes financiero y ventas) --}}
    @if(isset($datos['resumen']))
    <div class="summary">
        <h2>Resumen Ejecutivo</h2>
        <div class="summary-grid">
            @foreach($datos['resumen'] as $key => $value)
                <div class="summary-item">
                    <span class="label">{{ ucfirst(str_replace('_', ' ', $key)) }}</span>
                    <span class="value">
                        @if(str_contains($key, 'total') || str_contains($key, 'ingresos') || str_contains($key, 'comisiones') || str_contains($key, 'neto'))
                            ${{ number_format($value, 2) }}
                        @else
                            {{ is_numeric($value) ? number_format($value, 0) : $value }}
                        @endif
                    </span>
                </div>
            @endforeach
        </div>
    </div>
    @endif

    @if(isset($datos['ventas_por_asesor']) && count($datos['ventas_por_asesor']) > 0)
    <div class="data-section">
        <h3>Ventas por Asesor</h3>
        <table>
            <thead>
                <tr>
                    <th>Asesor</th>
                    <th>Ventas</th>
                    <th>Total</th>
                    <th>Comisión</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos['ventas_por_asesor'] as $asesor)
                <tr>
                    <td>{{ $asesor['nombre'] }}</td>
                    <td>{{ $asesor['ventas'] }}</td>
                    <td>${{ number_format($asesor['total'], 2) }}</td>
                    <td>${{ number_format($asesor['comision'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Reporte de Ventas --}}
    @if($tipoReporte == 'ventas' && is_array($datos) && !isset($datos['resumen']))
    <div class="data-section">
        <h3>Detalle de Ventas</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Asesor</th>
                    <th>Departamento</th>
                    <th>Precio</th>
                    <th>Comisión</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos as $venta)
                <tr>
                    <td>{{ $venta['id'] }}</td>
                    <td>{{ $venta['fecha'] }}</td>
                    <td>{{ $venta['cliente'] }}</td>
                    <td>{{ $venta['asesor'] }}</td>
                    <td>{{ $venta['departamento'] }}</td>
                    <td>${{ number_format($venta['precio'], 2) }}</td>
                    <td>${{ number_format($venta['comision'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Reporte de Asesores --}}
    @if($tipoReporte == 'asesores' && is_array($datos))
    <div class="data-section">
        <h3>Rendimiento de Asesores</h3>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Ventas</th>
                    <th>Total Vendido</th>
                    <th>Comisiones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos as $asesor)
                <tr>
                    <td>{{ $asesor['nombre'] }}</td>
                    <td>{{ $asesor['email'] }}</td>
                    <td>{{ $asesor['ventas'] }}</td>
                    <td>${{ number_format($asesor['total_vendido'], 2) }}</td>
                    <td>${{ number_format($asesor['comisiones'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Reporte de Propiedades --}}
    @if($tipoReporte == 'propiedades' && is_array($datos))
    <div class="data-section">
        <h3>Estado de Propiedades</h3>
        <table>
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th>Precio</th>
                    <th>Habitaciones</th>
                    <th>Baños</th>
                    <th>Propietario</th>
                    <th>Destacado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos as $propiedad)
                <tr>
                    <td>{{ $propiedad['titulo'] }}</td>
                    <td>{{ $propiedad['ubicacion'] }}</td>
                    <td style="color: {{ $propiedad['estado'] == 'disponible' ? '#10b981' : ($propiedad['estado'] == 'ocupado' ? '#f59e0b' : '#ef4444') }};">
                        {{ ucfirst($propiedad['estado']) }}
                    </td>
                    <td>${{ number_format($propiedad['precio'], 2) }}</td>
                    <td>{{ $propiedad['habitaciones'] }}</td>
                    <td>{{ $propiedad['baños'] }}</td>
                    <td>{{ $propiedad['propietario'] }}</td>
                    <td style="text-align: center;">{{ $propiedad['destacado'] ? '⭐' : '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Reporte de Usuarios --}}
    @if($tipoReporte == 'usuarios' && is_array($datos))
    <div class="data-section">
        <h3>Usuarios del Sistema</h3>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Último Acceso</th>
                    <th>Registrado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos as $usuario)
                <tr>
                    <td>{{ $usuario['nombre'] }}</td>
                    <td>{{ $usuario['email'] }}</td>
                    <td style="color: {{ $usuario['role'] == 'administrador' ? '#ef4444' : ($usuario['role'] == 'asesor' ? '#3b82f6' : '#10b981') }};">
                        {{ ucfirst($usuario['role']) }}
                    </td>
                    <td>{{ $usuario['estado'] }}</td>
                    <td>{{ $usuario['ultimo_acceso'] }}</td>
                    <td>{{ $usuario['registrado'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    {{-- Reporte Financiero --}}
    @if($tipoReporte == 'financiero' && isset($datos['detalle']))
    <div class="data-section">
        <h3>Desglose Mensual</h3>
        <table>
            <thead>
                <tr>
                    <th>Mes</th>
                    <th>Ventas</th>
                    <th>Ingresos</th>
                    <th>Comisiones</th>
                    <th>Ingreso Neto</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos['detalle'] as $mes)
                <tr>
                    <td>{{ $mes['mes'] }}</td>
                    <td>{{ $mes['ventas'] }}</td>
                    <td style="color: #10b981;">${{ number_format($mes['ingresos'], 2) }}</td>
                    <td style="color: #ef4444;">${{ number_format($mes['comisiones'], 2) }}</td>
                    <td style="color: #3b82f6; font-weight: bold;">${{ number_format($mes['neto'], 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        <p>Este reporte fue generado automáticamente por el Sistema de Gestión Inmobiliaria</p>
        <p>© {{ date('Y') }} - Todos los derechos reservados</p>
    </div>
</body>
</html>
