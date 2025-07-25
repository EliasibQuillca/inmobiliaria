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

    @if(isset($datos['resumen']))
    <div class="summary">
        <h2>Resumen Ejecutivo</h2>
        <div class="summary-grid">
            @foreach($datos['resumen'] as $key => $value)
                <div class="summary-item">
                    <span class="label">{{ ucfirst(str_replace('_', ' ', $key)) }}</span>
                    <span class="value">{{ is_numeric($value) ? number_format($value, 2) : $value }}</span>
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

    @if(isset($datos['asesores']) && count($datos['asesores']) > 0)
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
                @foreach($datos['asesores'] as $asesor)
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

    @if(isset($datos['propiedades']) && count($datos['propiedades']) > 0)
    <div class="data-section">
        <h3>Estado de Propiedades</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Precio</th>
                    <th>Área</th>
                    <th>Habitaciones</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos['propiedades'] as $propiedad)
                <tr>
                    <td>{{ $propiedad['id'] }}</td>
                    <td>{{ $propiedad['titulo'] }}</td>
                    <td>${{ number_format($propiedad['precio'], 2) }}</td>
                    <td>{{ $propiedad['area'] }} m²</td>
                    <td>{{ $propiedad['habitaciones'] }}</td>
                    <td>{{ $propiedad['estado'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if(isset($datos['usuarios']) && count($datos['usuarios']) > 0)
    <div class="data-section">
        <h3>Usuarios del Sistema</h3>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Fecha Registro</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos['usuarios'] as $usuario)
                <tr>
                    <td>{{ $usuario['nombre'] }}</td>
                    <td>{{ $usuario['email'] }}</td>
                    <td>{{ $usuario['role'] }}</td>
                    <td>{{ $usuario['activo'] ? 'Activo' : 'Inactivo' }}</td>
                    <td>{{ \Carbon\Carbon::parse($usuario['fecha_registro'])->format('d/m/Y') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if(isset($datos['desglose']))
    <div class="data-section">
        <h3>Desglose Financiero</h3>
        <table>
            <thead>
                <tr>
                    <th>Concepto</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
                @foreach($datos['desglose'] as $concepto => $monto)
                <tr>
                    <td>{{ ucfirst(str_replace('_', ' ', $concepto)) }}</td>
                    <td>${{ number_format($monto, 2) }}</td>
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
