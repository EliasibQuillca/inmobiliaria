# Inventario de Componentes UI y Estado Actual

## 1. Botones (Buttons)
Existen múltiples definiciones y estilos de botones dispersos:
- **PrimaryButton** (`resources/js/components/PrimaryButton.jsx`):
  - Estilo: `bg-gray-800`, `text-white`, `hover:bg-gray-700`.
  - Uso: Formularios de autenticación, acciones principales genéricas.
- **SecondaryButton** (`resources/js/components/SecondaryButton.jsx`):
  - Estilo: `bg-white`, `text-gray-700`, `border-gray-300`.
  - Uso: Cancelar, acciones secundarias.
- **DangerButton** (`resources/js/components/DangerButton.jsx`):
  - Estilo: `bg-red-600`, `text-white`.
  - Uso: Eliminar cuenta, acciones destructivas.
- **Botones Ad-hoc (Inline)**:
  - En `DepartamentoCard.jsx`: `bg-primary`, `hover:bg-primary-dark` (Clases personalizadas no estándar en Tailwind por defecto).
  - En `AuthenticatedLayout.jsx`: `bg-teal-600` (Tema Teal).
  - En `GuestLayout.jsx`: Gradientes Amber/Yellow.

## 2. Entradas (Inputs)
Inconsistencia en los estados de foco y estilos:
- **TextInput (Root)** (`resources/js/components/TextInput.jsx`):
  - Focus: `focus:border-indigo-500`, `focus:ring-indigo-500`.
- **TextInput (Common)** (`resources/js/components/common/TextInput.jsx`):
  - Focus: `focus:border-indigo-300`, `focus:ring-indigo-200`.
- **SelectInput** (`resources/js/components/common/SelectInput.jsx`):
  - Focus: `focus:border-indigo-300`, `focus:ring-indigo-200`.
- **Checkbox**:
  - Color: `text-indigo-600`.

## 3. Tarjetas (Cards) y Contenedores
- **DepartamentoCard**: `rounded-lg`, `shadow-md`.
- **GuestLayout Card**: `rounded-xl`, `shadow-xl`.
- **Modal Panel**: `rounded-lg`, `shadow-xl`.

## 4. Colores y Temas
Se observan tres "temas" compitiendo:
1. **Indigo/Gray**: Tema por defecto de Laravel Breeze (Login, Inputs).
2. **Teal**: Tema usado en el Dashboard (`AuthenticatedLayout`, `ApplicationLogo`).
3. **Amber/Yellow**: Usado en `GuestLayout` (Branding "Imperial").

## Propuesta de Estandarización (Design System Primitives)

Se propone crear un set de componentes "Primitivos" en `resources/js/Components/DesignSystem` que unifiquen estos estilos bajo un solo lenguaje de diseño.

### 1. Paleta de Colores Sugerida
Definir colores semánticos en `tailwind.config.js` o usar clases consistentes:
- **Primary**: Teal-600 (para alinearse con el Dashboard) o Indigo-600 (Breeze). *Recomendación: Teal para identidad de marca.*
- **Secondary**: Gray-200/Gray-800.
- **Danger**: Red-600.

### 2. Componentes Primitivos
- **Button**:
  - Variants: `primary` (Teal), `secondary` (Outline), `danger` (Red), `ghost` (Transparent).
  - Sizes: `sm`, `md`, `lg`.
- **Input / Select**:
  - Unificar focus ring a `ring-teal-500` (o color primario elegido).
- **Card**:
  - Unificar `rounded-lg` y `shadow-sm` (o `md`) como estándar.
- **Badge**:
  - Para estados (ej. "Venta", "Alquiler").

### 3. Plan de Migración
1. Crear carpeta `resources/js/Components/DS`.
2. Crear `Button.jsx` y `Input.jsx` con las nuevas variantes.
3. Reemplazar progresivamente en `AuthenticatedLayout` y `DepartamentoCard`.
