<!DOCTYPE html>
<html>
<head>
    <title>Test PDF</title>
</head>
<body>
    <h1>Reporte de Prueba</h1>
    <p>Este es un PDF de testing generado en {{ date('Y-m-d H:i:s') }}</p>
    <p>Tipo: {{ $tipo ?? 'Sin tipo' }}</p>
</body>
</html>
