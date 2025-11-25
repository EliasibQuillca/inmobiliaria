<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Propiedades</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
        }

        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 20px;
            margin-bottom: 20px;
            text-align: center;
        }

        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 12px;
            opacity: 0.9;
        }

        .info-section {
            background-color: #f8f9fa;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #4f46e5;
        }

        .info-section h3 {
            color: #4f46e5;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }

        .info-item {
            display: flex;
            justify-content: space-between;
        }

        .info-label {
            font-weight: bold;
            color: #666;
        }

        .info-value {
            color: #333;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: white;
        }

        thead {
            background-color: #4f46e5;
            color: white;
        }

        th {
            padding: 10px 8px;
            text-align: left;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 10px;
        }

        tbody tr:nth-child(even) {
            background-color: #f9fafb;
        }

        tbody tr:hover {
            background-color: #f3f4f6;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-disponible {
            background-color: #d1fae5;
            color: #065f46;
        }

        .badge-vendido {
            background-color: #fee2e2;
            color: #991b1b;
        }

        .badge-reservado {
            background-color: #fef3c7;
            color: #92400e;
        }

        .badge-inactivo {
            background-color: #f3f4f6;
            color: #4b5563;
        }

        .destacado-icon {
            color: #f59e0b;
            font-weight: bold;
        }

        .precio {
            font-weight: 600;
            color: #059669;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            padding: 10px;
            font-size: 9px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }

        .page-break {
            page-break-after: always;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }

        .summary-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e5e7eb;
        }

        .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 5px;
        }

        .summary-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Reporte de Propiedades</h1>
        <p>Sistema Inmobiliario - Generado el {{ $fecha_generacion }}</p>
    </div>

    <div class="info-section">
        <h3>Información del Reporte</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Total de Propiedades:</span>
                <span class="info-value">{{ $total }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Fecha de Generación:</span>
                <span class="info-value">{{ $fecha_generacion }}</span>
            </div>
            @if(isset($filtros['busqueda']) && $filtros['busqueda'])
            <div class="info-item">
                <span class="info-label">Búsqueda:</span>
                <span class="info-value">{{ $filtros['busqueda'] }}</span>
            </div>
            @endif
            @if(isset($filtros['estado']) && $filtros['estado'])
            <div class="info-item">
                <span class="info-label">Estado Filtrado:</span>
                <span class="info-value">{{ ucfirst($filtros['estado']) }}</span>
            </div>
            @endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Ubicación</th>
                <th>Precio</th>
                <th>Hab/Baños</th>
                <th>Área</th>
                <th>Estado</th>
                <th>Dest.</th>
            </tr>
        </thead>
        <tbody>
            @forelse($departamentos as $depto)
            <tr>
                <td><strong>{{ $depto['codigo'] ?? 'N/A' }}</strong></td>
                <td>{{ $depto['titulo'] ?? 'Sin título' }}</td>
                <td>{{ $depto['ubicacion'] ?? 'Sin ubicación' }}</td>
                <td class="precio">S/. {{ number_format($depto['precio'] ?? 0, 2) }}</td>
                <td>{{ $depto['habitaciones'] ?? 0 }} / {{ $depto['banos'] ?? 0 }}</td>
                <td>{{ $depto['area'] ?? 0 }} m²</td>
                <td>
                    @php
                        $estado = $depto['estado'] ?? 'disponible';
                        $badgeClass = 'badge-' . $estado;
                    @endphp
                    <span class="badge {{ $badgeClass }}">{{ ucfirst($estado) }}</span>
                </td>
                <td style="text-align: center;">
                    @if(isset($depto['destacado']) && $depto['destacado'])
                        <span class="destacado-icon">★</span>
                    @else
                        <span style="color: #d1d5db;">☆</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" style="text-align: center; padding: 20px; color: #9ca3af;">
                    No hay propiedades para mostrar
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Sistema Inmobiliario © {{ date('Y') }} - Documento generado automáticamente</p>
        <p>Página {PAGE_NUM} de {PAGE_COUNT}</p>
    </div>
</body>
</html>
