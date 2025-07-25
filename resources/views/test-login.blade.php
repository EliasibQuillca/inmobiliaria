<!DOCTYPE html>
<html>
<head>
    <title>Test Login</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .container { max-width: 400px; }
        input, button { width: 100%; padding: 10px; margin: 5px 0; }
        button { background: #3b82f6; color: white; border: none; cursor: pointer; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Login de Prueba - Asesor</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        @if(session('error'))
            <div class="error">{{ session('error') }}</div>
        @endif

        <form method="POST" action="{{ route('test.login') }}">
            @csrf
            <input type="email" name="email" placeholder="Email" value="asesor@inmobiliaria.com" required>
            <input type="password" name="password" placeholder="Password" value="password" required>
            <button type="submit">Iniciar Sesión</button>
        </form>

        <hr>
        <p><strong>Credenciales de prueba:</strong></p>
        <p>Email: asesor@inmobiliaria.com</p>
        <p>Password: password</p>

        @auth
            <div class="success">
                <p>✅ Usuario autenticado: {{ auth()->user()->email }}</p>
                <p><a href="{{ route('asesor.clientes.index') }}">Ir a Gestión de Clientes</a></p>
            </div>
        @endauth
    </div>
</body>
</html>
