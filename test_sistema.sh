#!/bin/bash

# Script de Pruebas Automáticas del Sistema Inmobiliario
# Ejecuta pruebas básicas para verificar que todo funciona correctamente

echo "🚀 Iniciando pruebas del sistema inmobiliario..."
echo "=================================================="

# Función para hacer peticiones HTTP y verificar respuestas
function test_endpoint() {
    local url="$1"
    local expected_status="$2"
    local description="$3"
    
    echo -n "🧪 Probando: $description... "
    
    # Hacer petición con curl (Windows compatible)
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ PASÓ (HTTP $response)"
        return 0
    else
        echo "❌ FALLÓ (HTTP $response, esperado $expected_status)"
        return 1
    fi
}

# Variables de configuración
BASE_URL="http://127.0.0.1:8000"
TESTS_PASSED=0
TESTS_FAILED=0

echo "🌐 URL Base: $BASE_URL"
echo ""

# Pruebas de endpoints públicos
echo "📋 PRUEBAS DE ENDPOINTS PÚBLICOS"
echo "--------------------------------"

test_endpoint "$BASE_URL/" "302" "Página de inicio (redirige a catálogo)"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

test_endpoint "$BASE_URL/catalogo" "200" "Catálogo público de departamentos"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

test_endpoint "$BASE_URL/login" "200" "Página de login"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

test_endpoint "$BASE_URL/register" "200" "Página de registro"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

test_endpoint "$BASE_URL/csrf-token" "200" "Endpoint de token CSRF"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

echo ""

# Pruebas de API
echo "🔌 PRUEBAS DE API"
echo "-----------------"

test_endpoint "$BASE_URL/api/departamentos" "200" "API de departamentos"
if [ $? -eq 0 ]; then ((TESTS_PASSED++)); else ((TESTS_FAILED++)); fi

echo ""

# Verificación de archivos críticos
echo "📁 VERIFICACIÓN DE ARCHIVOS CRÍTICOS"
echo "------------------------------------"

check_file() {
    local file="$1"
    local description="$2"
    
    echo -n "📄 Verificando: $description... "
    
    if [ -f "$file" ]; then
        echo "✅ EXISTE"
        ((TESTS_PASSED++))
    else
        echo "❌ NO EXISTE"
        ((TESTS_FAILED++))
    fi
}

# Verificar archivos importantes
check_file "resources/js/Pages/Auth/Login.jsx" "Componente Login"
check_file "resources/js/utils/csrf.js" "Utilidad CSRF"
check_file "app/Http/Middleware/HandleCsrfToken.php" "Middleware CSRF personalizado"
check_file "resources/js/Pages/Public/Catalogo.jsx" "Página de catálogo público"
check_file "resources/js/Pages/Public/DetalleDepartamento.jsx" "Página de detalle de departamento"

echo ""

# Verificación de configuración
echo "⚙️ VERIFICACIÓN DE CONFIGURACIÓN"
echo "--------------------------------"

echo -n "🔍 Verificando configuración de sesión... "
if grep -q "SESSION_DRIVER=database" .env 2>/dev/null; then
    echo "✅ CORRECTO (database)"
    ((TESTS_PASSED++))
else
    echo "❌ INCORRECTO o NO ENCONTRADO"
    ((TESTS_FAILED++))
fi

echo -n "🔍 Verificando tiempo de sesión... "
if grep -q "SESSION_LIFETIME=120" .env 2>/dev/null; then
    echo "✅ CORRECTO (120 minutos)"
    ((TESTS_PASSED++))
else
    echo "⚠️ REVISAR (.env)"
    ((TESTS_FAILED++))
fi

echo ""

# Resumen de pruebas
echo "📊 RESUMEN DE PRUEBAS"
echo "===================="
echo "✅ Pruebas que pasaron: $TESTS_PASSED"
echo "❌ Pruebas que fallaron: $TESTS_FAILED"
echo "📈 Total de pruebas: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo "🎉 ¡TODAS LAS PRUEBAS PASARON!"
    echo "✨ El sistema está funcionando correctamente."
    exit 0
else
    echo ""
    echo "⚠️ ALGUNAS PRUEBAS FALLARON"
    echo "🔧 Revisa los errores arriba para solucionarlos."
    exit 1
fi
