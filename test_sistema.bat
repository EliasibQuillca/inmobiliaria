@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM Script de Pruebas Automáticas del Sistema Inmobiliario
REM Ejecuta pruebas básicas para verificar que todo funciona correctamente

echo 🚀 Iniciando pruebas del sistema inmobiliario...
echo ==================================================

REM Variables de configuración
set BASE_URL=http://127.0.0.1:8000
set TESTS_PASSED=0
set TESTS_FAILED=0

echo 🌐 URL Base: %BASE_URL%
echo.

REM Función para hacer peticiones HTTP y verificar respuestas
:test_endpoint
setlocal
set "url=%~1"
set "expected_status=%~2"
set "description=%~3"

echo|set /p="🧪 Probando: %description%... "

REM Hacer petición con curl
for /f %%i in ('curl -s -o nul -w "%%{http_code}" "%url%" 2^>nul ^|^| echo 000') do set response=%%i

if "%response%"=="%expected_status%" (
    echo ✅ PASÓ ^(HTTP %response%^)
    set /a TESTS_PASSED+=1
) else (
    echo ❌ FALLÓ ^(HTTP %response%, esperado %expected_status%^)
    set /a TESTS_FAILED+=1
)
endlocal & set TESTS_PASSED=%TESTS_PASSED% & set TESTS_FAILED=%TESTS_FAILED%
goto :eof

REM Pruebas de endpoints públicos
echo 📋 PRUEBAS DE ENDPOINTS PÚBLICOS
echo --------------------------------

call :test_endpoint "%BASE_URL%/" "302" "Página de inicio (redirige a catálogo)"
call :test_endpoint "%BASE_URL%/catalogo" "200" "Catálogo público de departamentos"
call :test_endpoint "%BASE_URL%/login" "200" "Página de login"
call :test_endpoint "%BASE_URL%/register" "200" "Página de registro"
call :test_endpoint "%BASE_URL%/csrf-token" "200" "Endpoint de token CSRF"

echo.

REM Pruebas de API
echo 🔌 PRUEBAS DE API
echo -----------------

call :test_endpoint "%BASE_URL%/api/departamentos" "200" "API de departamentos"

echo.

REM Verificación de archivos críticos
echo 📁 VERIFICACIÓN DE ARCHIVOS CRÍTICOS
echo ------------------------------------

:check_file
setlocal
set "file=%~1"
set "description=%~2"

echo|set /p="📄 Verificando: %description%... "

if exist "%file%" (
    echo ✅ EXISTE
    set /a TESTS_PASSED+=1
) else (
    echo ❌ NO EXISTE
    set /a TESTS_FAILED+=1
)
endlocal & set TESTS_PASSED=%TESTS_PASSED% & set TESTS_FAILED=%TESTS_FAILED%
goto :eof

REM Verificar archivos importantes
call :check_file "resources\js\Pages\Auth\Login.jsx" "Componente Login"
call :check_file "resources\js\utils\csrf.js" "Utilidad CSRF"
call :check_file "app\Http\Middleware\HandleCsrfToken.php" "Middleware CSRF personalizado"
call :check_file "resources\js\Pages\Public\Catalogo.jsx" "Página de catálogo público"
call :check_file "resources\js\Pages\Public\DetalleDepartamento.jsx" "Página de detalle de departamento"

echo.

REM Verificación de configuración
echo ⚙️ VERIFICACIÓN DE CONFIGURACIÓN
echo --------------------------------

echo|set /p="🔍 Verificando configuración de sesión... "
findstr /C:"SESSION_DRIVER=database" .env >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ CORRECTO ^(database^)
    set /a TESTS_PASSED+=1
) else (
    echo ❌ INCORRECTO o NO ENCONTRADO
    set /a TESTS_FAILED+=1
)

echo|set /p="🔍 Verificando tiempo de sesión... "
findstr /C:"SESSION_LIFETIME=120" .env >nul 2>&1
if !errorlevel! equ 0 (
    echo ✅ CORRECTO ^(120 minutos^)
    set /a TESTS_PASSED+=1
) else (
    echo ⚠️ REVISAR ^(.env^)
    set /a TESTS_FAILED+=1
)

echo.

REM Resumen de pruebas
echo 📊 RESUMEN DE PRUEBAS
echo ====================
echo ✅ Pruebas que pasaron: %TESTS_PASSED%
echo ❌ Pruebas que fallaron: %TESTS_FAILED%
set /a TOTAL_TESTS=%TESTS_PASSED%+%TESTS_FAILED%
echo 📈 Total de pruebas: %TOTAL_TESTS%

if %TESTS_FAILED% equ 0 (
    echo.
    echo 🎉 ¡TODAS LAS PRUEBAS PASARON!
    echo ✨ El sistema está funcionando correctamente.
    exit /b 0
) else (
    echo.
    echo ⚠️ ALGUNAS PRUEBAS FALLARON
    echo 🔧 Revisa los errores arriba para solucionarlos.
    exit /b 1
)
