-- BASE DE DATOS CORREGIDA PARA PROYECTO INMOBILIARIA
-- Corrige todos los problemas de relaciones y campos faltantes

CREATE DATABASE IF NOT EXISTS `mgzejflo_inmobiliaria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mgzejflo_inmobiliaria`;

-- ===================================
-- TABLAS DEL SISTEMA LARAVEL
-- ===================================

-- Tabla: users (CORREGIDA)
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('cliente','asesor','administrador') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `estado` enum('activo','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: password_reset_tokens
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: sessions
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: personal_access_tokens (AGREGADA - faltaba para Sanctum)
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tablas de sistema Laravel (jobs, failed_jobs, etc.)
CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- TABLAS DEL NEGOCIO INMOBILIARIO
-- ===================================

-- Tabla: propietarios
CREATE TABLE `propietarios` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('natural','juridico') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'natural',
  `contacto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registrado_sunarp` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `propietarios_dni_unique` (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: asesores (CORREGIDA)
CREATE TABLE `asesores` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_contrato` date NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `especialidad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experiencia` int(11) DEFAULT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  `estado` enum('activo','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activo',
  `comision_porcentaje` double(8,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asesores_usuario_id_unique` (`usuario_id`),
  UNIQUE KEY `asesores_documento_unique` (`documento`),
  CONSTRAINT `asesores_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: clientes (CORREGIDA - agregando campos de preferencias)
CREATE TABLE `clientes` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) UNSIGNED DEFAULT NULL,
  `asesor_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `departamento_interes` bigint(20) UNSIGNED DEFAULT NULL,
  `notas_contacto` text COLLATE utf8mb4_unicode_ci,
  `medio_contacto` enum('whatsapp','telefono','presencial','email','referido') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('contactado','interesado','sin_interes','perdido','cita_agendada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'contactado',
  `notas_seguimiento` text COLLATE utf8mb4_unicode_ci,
  `fecha_cita` datetime DEFAULT NULL,
  `tipo_cita` enum('presencial','virtual','telefonica') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ubicacion_cita` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notas_cita` text COLLATE utf8mb4_unicode_ci,
  `tipo_propiedad` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'apartamento',
  `habitaciones_deseadas` int(11) DEFAULT NULL,
  `presupuesto_min` decimal(15,2) DEFAULT NULL,
  `presupuesto_max` decimal(15,2) DEFAULT NULL,
  `zona_preferida` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dni` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` date NOT NULL DEFAULT (curdate()),
  -- CAMPOS DE PREFERENCIAS AGREGADOS
  `ciudad` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocupacion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_civil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ingresos_mensuales` decimal(15,2) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  -- PREFERENCIAS JSON PARA BÚSQUEDAS
  `preferencias` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clientes_dni_unique` (`dni`),
  KEY `clientes_usuario_id_foreign` (`usuario_id`),
  KEY `clientes_asesor_id_foreign` (`asesor_id`),
  CONSTRAINT `clientes_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `asesores` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `clientes_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: departamentos (CORREGIDA - agregando campos de imágenes)
CREATE TABLE `departamentos` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ubicacion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `precio_anterior` decimal(12,2) DEFAULT NULL,
  `dormitorios` int(11) DEFAULT NULL,
  `banos` int(11) DEFAULT NULL,
  `area_total` decimal(8,2) DEFAULT NULL,
  `estacionamientos` int(11) NOT NULL DEFAULT '0',
  `estado` enum('disponible','reservado','vendido','inactivo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'disponible',
  `destacado` tinyint(1) NOT NULL DEFAULT '0',
  `disponible` tinyint(1) NOT NULL DEFAULT '1',
  `propietario_id` bigint(20) UNSIGNED NOT NULL,
  -- CAMPOS DE IMÁGENES AGREGADOS
  `imagen_principal` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_galeria_1` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_galeria_2` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_galeria_3` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_galeria_4` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagen_galeria_5` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departamentos_codigo_unique` (`codigo`),
  KEY `departamentos_propietario_id_foreign` (`propietario_id`),
  CONSTRAINT `departamentos_propietario_id_foreign` FOREIGN KEY (`propietario_id`) REFERENCES `propietarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: publicaciones
CREATE TABLE `publicaciones` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date DEFAULT NULL,
  `precio_oferta` decimal(12,2) NOT NULL,
  `estado` enum('activa','pausada','expirada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activa',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `publicaciones_departamento_id_foreign` (`departamento_id`),
  CONSTRAINT `publicaciones_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: atributos
CREATE TABLE `atributos` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('string','number','boolean','date') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: departamento_atributo
CREATE TABLE `departamento_atributo` (
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `atributo_id` bigint(20) UNSIGNED NOT NULL,
  `valor` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`departamento_id`,`atributo_id`),
  KEY `departamento_atributo_atributo_id_foreign` (`atributo_id`),
  CONSTRAINT `departamento_atributo_atributo_id_foreign` FOREIGN KEY (`atributo_id`) REFERENCES `atributos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `departamento_atributo_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: cotizaciones (CORREGIDA COMPLETAMENTE)
CREATE TABLE `cotizaciones` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `asesor_id` bigint(20) UNSIGNED NOT NULL,
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `cliente_id` bigint(20) UNSIGNED DEFAULT NULL,
  -- CAMPOS DE SOLICITUD
  `tipo_solicitud` enum('informacion','visita','financiamiento','cotizacion') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'informacion',
  `mensaje_solicitud` text COLLATE utf8mb4_unicode_ci,
  `telefono_contacto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  -- CAMPOS ADICIONALES DE LA MIGRACIÓN add_solicitudes_fields
  `tipo` enum('informacion','visita','financiamiento','cotizacion') COLLATE utf8mb4_unicode_ci DEFAULT 'informacion',
  `mensaje` text COLLATE utf8mb4_unicode_ci,
  `telefono` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `disponibilidad` json DEFAULT NULL,
  `preferencia_contacto` enum('email','telefono','whatsapp') COLLATE utf8mb4_unicode_ci DEFAULT 'email',
  -- CAMPOS DE COTIZACIÓN
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `monto` decimal(12,2) NOT NULL,
  `descuento` decimal(5,2) DEFAULT NULL,
  `estado` enum('pendiente','aprobada','rechazada','vencida','en_proceso','completada','cancelada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `fecha_validez` date NOT NULL,
  `notas` text COLLATE utf8mb4_unicode_ci,
  `condiciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cotizaciones_asesor_id_foreign` (`asesor_id`),
  KEY `cotizaciones_departamento_id_foreign` (`departamento_id`),
  KEY `cotizaciones_cliente_id_foreign` (`cliente_id`),
  CONSTRAINT `cotizaciones_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `asesores` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `cotizaciones_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `cotizaciones_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: reservas (CORREGIDA COMPLETAMENTE)
CREATE TABLE `reservas` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint(20) UNSIGNED DEFAULT NULL,
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `asesor_id` bigint(20) UNSIGNED NOT NULL,
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_reserva` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `monto_reserva` decimal(12,2) NOT NULL,
  `monto_total` decimal(12,2) NOT NULL,
  `estado` enum('activa','cancelada','completada') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'activa',
  `notas` text COLLATE utf8mb4_unicode_ci,
  `condiciones` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reservas_cotizacion_id_foreign` (`cotizacion_id`),
  KEY `reservas_cliente_id_foreign` (`cliente_id`),
  KEY `reservas_asesor_id_foreign` (`asesor_id`),
  KEY `reservas_departamento_id_foreign` (`departamento_id`),
  CONSTRAINT `reservas_asesor_id_foreign` FOREIGN KEY (`asesor_id`) REFERENCES `asesores` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservas_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reservas_cotizacion_id_foreign` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT `reservas_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: ventas (CORREGIDA COMPLETAMENTE)
CREATE TABLE `ventas` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `reserva_id` bigint(20) UNSIGNED NOT NULL,
  `fecha_venta` date NOT NULL,
  `monto_final` decimal(12,2) NOT NULL,
  `documentos_entregados` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ventas_reserva_id_unique` (`reserva_id`),
  CONSTRAINT `ventas_reserva_id_foreign` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: auditoria_usuarios (CORREGIDA COMPLETAMENTE)
CREATE TABLE `auditoria_usuarios` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint(20) UNSIGNED NOT NULL,
  `accion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalles` json DEFAULT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auditoria_usuarios_usuario_id_foreign` (`usuario_id`),
  CONSTRAINT `auditoria_usuarios_usuario_id_foreign` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: imagenes (CORREGIDA COMPLETAMENTE)
CREATE TABLE `imagenes` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` enum('principal','galeria','plano') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'galeria',
  `orden` int(11) NOT NULL DEFAULT '1',
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `imagenes_departamento_id_foreign` (`departamento_id`),
  KEY `imagenes_departamento_id_tipo_orden_index` (`departamento_id`,`tipo`,`orden`),
  KEY `imagenes_departamento_id_activa_index` (`departamento_id`,`activa`),
  CONSTRAINT `imagenes_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: comentarios_solicitud (CORREGIDA COMPLETAMENTE)
CREATE TABLE `comentarios_solicitud` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cotizacion_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('cliente','asesor','sistema') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cliente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comentarios_solicitud_cotizacion_id_foreign` (`cotizacion_id`),
  KEY `comentarios_solicitud_user_id_foreign` (`user_id`),
  CONSTRAINT `comentarios_solicitud_cotizacion_id_foreign` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentarios_solicitud_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: favoritos (CORREGIDA COMPLETAMENTE)
CREATE TABLE `favoritos` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) UNSIGNED NOT NULL,
  `departamento_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `favoritos_cliente_id_departamento_id_unique` (`cliente_id`,`departamento_id`),
  KEY `favoritos_departamento_id_foreign` (`departamento_id`),
  CONSTRAINT `favoritos_cliente_id_foreign` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_departamento_id_foreign` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: migrations
CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- INSERTAR DATOS DE MIGRACIÓN
-- ===================================

INSERT INTO `migrations` (`migration`, `batch`) VALUES
('0001_01_01_000000_create_users_table', 1),
('0001_01_01_000001_create_cache_table', 1),
('0001_01_01_000002_create_jobs_table', 1),
('2025_07_14_000000_create_propietarios_table', 2),
('2025_07_14_000001_create_clientes_table', 2),
('2025_07_14_000002_create_asesores_table', 2),
('2025_07_14_000003_create_departamentos_table', 2),
('2025_07_14_000004_create_publicaciones_table', 2),
('2025_07_14_000005_create_atributos_table', 2),
('2025_07_14_000006_create_departamento_atributo_table', 2),
('2025_07_14_000007_create_cotizaciones_table', 2),
('2025_07_14_000008_create_reservas_table', 2),
('2025_07_14_000009_create_ventas_table', 2),
('2025_07_14_000010_create_auditoria_usuarios_table', 2),
('2025_07_14_171913_create_personal_access_tokens_table', 2),
('2025_07_15_000000_add_fields_to_asesores_table', 3),
('2025_07_15_000001_add_solicitudes_fields', 3),
('2025_07_15_000001_update_cotizaciones_table', 3),
('2025_07_15_000002_update_reservas_table', 3),
('2025_07_15_030005_create_imagenes_table', 3),
('2025_07_15_035646_add_catalog_fields_to_departamentos_table', 3),
('2025_07_21_000001_add_destacado_to_departamentos_table', 4),
('2025_07_23_060214_add_estado_to_users_table', 4),
('2025_07_23_160000_add_image_urls_to_departamentos_table', 4),
('2025_07_25_035016_add_asesor_id_to_clientes_table', 5),
('2025_07_25_035221_update_clientes_usuario_id_nullable', 5),
('2025_07_25_040159_add_preferences_to_clientes_table', 5),
('2025_07_30_040000_add_solicitud_fields_to_cotizaciones_table', 6),
('2025_07_30_041516_add_solicitud_fields_to_cotizaciones_table', 6);

-- ===================================
-- DATOS DE PRUEBA
-- ===================================

-- Propietarios
INSERT INTO `propietarios` (`id`, `nombre`, `dni`, `tipo`, `contacto`, `direccion`, `registrado_sunarp`, `created_at`, `updated_at`) VALUES
(1, 'Juan Pérez', '12345001', 'natural', 'juan.perez@email.com / 987654321', 'Av. Principal 123', 1, NOW(), NOW()),
(2, 'María González', '12345002', 'natural', 'maria.gonzalez@email.com / 976543210', 'Calle Secundaria 456', 1, NOW(), NOW()),
(3, 'Constructora SAC', '20123456789', 'juridico', 'ventas@constructora.com / 986543210', 'Av. Industrial 789', 1, NOW(), NOW());

-- Usuarios
INSERT INTO `users` (`id`, `name`, `email`, `telefono`, `password`, `role`, `estado`, `email_verified_at`, `created_at`, `updated_at`) VALUES
(1, 'Admin Sistema', 'admin@test.com', '999999999', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'administrador', 'activo', NOW(), NOW(), NOW()),
(2, 'Asesor Prueba', 'asesor@test.com', '987654321', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'asesor', 'activo', NOW(), NOW(), NOW()),
(3, 'Cliente Uno', 'cliente1@test.com', '987654321', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente', 'activo', NOW(), NOW(), NOW()),
(4, 'Cliente Dos', 'cliente2@test.com', '567890123', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente', 'activo', NOW(), NOW(), NOW()),
(5, 'Ana López', 'ana@test.com', '912345678', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente', 'activo', NOW(), NOW(), NOW());

-- Asesores
INSERT INTO `asesores` (`id`, `usuario_id`, `fecha_contrato`, `nombre`, `apellidos`, `telefono`, `documento`, `direccion`, `fecha_nacimiento`, `especialidad`, `experiencia`, `biografia`, `estado`, `comision_porcentaje`, `created_at`, `updated_at`) VALUES
(1, 2, CURDATE(), 'Asesor', 'De Prueba', '123456789', '33333333', 'Dirección Asesor', '1990-01-01', 'Ventas Departamentos', 5, 'Asesor especializado en ventas de departamentos con 5 años de experiencia', 'activo', 5.00, NOW(), NOW());

-- Clientes con datos completos
INSERT INTO `clientes` (`id`, `usuario_id`, `asesor_id`, `nombre`, `telefono`, `email`, `dni`, `direccion`, `fecha_registro`, `ciudad`, `ocupacion`, `estado_civil`, `ingresos_mensuales`, `fecha_nacimiento`, `cedula`, `tipo_propiedad`, `habitaciones_deseadas`, `presupuesto_min`, `presupuesto_max`, `zona_preferida`, `preferencias`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 'Cliente Uno', '987654321', 'cliente1@test.com', '11111111', 'Dirección Cliente 1', CURDATE(), 'Lima', 'Ingeniero', 'soltero', 8000.00, '1995-05-15', '11111111', 'departamento', 2, 150000.00, 250000.00, 'Miraflores', '{"tipo_propiedad": "departamento", "habitaciones_min": 2, "banos_min": 1, "ubicaciones_preferidas": ["Miraflores", "San Isidro"], "notificaciones_email": true}', NOW(), NOW()),
(2, 4, 1, 'Cliente Dos', '567890123', 'cliente2@test.com', '22222222', 'Dirección Cliente 2', CURDATE(), 'Lima', 'Contador', 'casado', 6500.00, '1988-12-20', '22222222', 'departamento', 3, 200000.00, 350000.00, 'San Isidro', '{"tipo_propiedad": "departamento", "habitaciones_min": 3, "banos_min": 2, "ubicaciones_preferidas": ["San Isidro", "La Molina"], "notificaciones_email": true}', NOW(), NOW()),
(3, 5, NULL, 'Ana López', '912345678', 'ana@test.com', '44444444', 'Av. Universitaria 123', CURDATE(), 'Lima', 'Doctora', 'soltera', 12000.00, '1985-03-10', '44444444', 'departamento', 2, 300000.00, 500000.00, 'Surco', '{"tipo_propiedad": "departamento", "habitaciones_min": 2, "banos_min": 2, "ubicaciones_preferidas": ["Surco", "San Borja"], "notificaciones_email": true}', NOW(), NOW());

-- Departamentos
INSERT INTO `departamentos` (`id`, `codigo`, `titulo`, `descripcion`, `ubicacion`, `direccion`, `precio`, `precio_anterior`, `dormitorios`, `banos`, `area_total`, `estacionamientos`, `estado`, `destacado`, `disponible`, `propietario_id`, `imagen_principal`, `creado_en`, `created_at`, `updated_at`) VALUES
(1, 'DEPT-001', 'Departamento Los Andes 501', 'Hermoso departamento con vista panorámica en zona residencial. Cuenta con acabados de primera, cocina equipada y amplios ambientes.', 'Los Olivos', 'Av. Los Andes 123, Dpto 501', 250000.00, 280000.00, 3, 2, 120.50, 1, 'disponible', 1, 1, 1, '/images/dept001/principal.jpg', NOW(), NOW(), NOW()),
(2, 'DEPT-002', 'Departamento Lima 302', 'Acogedor departamento en el centro de la ciudad, ideal para profesionales jóvenes. Cerca a centros comerciales y transporte público.', 'Lima Centro', 'Jr. Lima 456, Dpto 302', 180000.00, NULL, 2, 1, 85.75, 0, 'disponible', 0, 1, 1, '/images/dept002/principal.jpg', NOW(), NOW(), NOW()),
(3, 'DEPT-003', 'Departamento Central 204', 'Exclusivo departamento con acabados de lujo en zona premium. Vista al mar y amenities completos.', 'San Isidro', 'Av. Central 789, Dpto 204', 420000.00, 450000.00, 4, 3, 150.25, 2, 'disponible', 1, 1, 2, '/images/dept003/principal.jpg', NOW(), NOW(), NOW()),
(4, 'DEPT-004', 'Departamento Las Flores 101', 'Cómodo departamento para familias jóvenes. Zona segura con áreas verdes y parques cercanos.', 'Miraflores', 'Calle Las Flores 321, Dpto 101', 350000.00, NULL, 3, 2, 110.00, 1, 'reservado', 0, 0, 2, '/images/dept004/principal.jpg', NOW(), NOW(), NOW()),
(5, 'DEPT-005', 'Departamento Universitaria 601', 'Moderno departamento cerca a universidades. Ideal para estudiantes o profesionales jóvenes.', 'San Miguel', 'Av. Universitaria 654, Dpto 601', 280000.00, NULL, 3, 2, 110.80, 1, 'disponible', 0, 1, 1, '/images/dept005/principal.jpg', NOW(), NOW(), NOW()),
(6, 'DEPT-006', 'Penthouse Surco Premium', 'Espectacular penthouse con terraza privada y vista 360°. Amenities exclusivos y acabados importados.', 'Surco', 'Av. Santiago de Surco 999, PH 1', 650000.00, 700000.00, 4, 4, 200.00, 2, 'disponible', 1, 1, 3, '/images/dept006/principal.jpg', NOW(), NOW(), NOW());

-- Publicaciones activas
INSERT INTO `publicaciones` (`id`, `departamento_id`, `fecha_inicio`, `fecha_fin`, `precio_oferta`, `estado`, `created_at`, `updated_at`) VALUES
(1, 1, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 250000.00, 'activa', NOW(), NOW()),
(2, 2, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 180000.00, 'activa', NOW(), NOW()),
(3, 3, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 120 DAY), 420000.00, 'activa', NOW(), NOW()),
(4, 5, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 90 DAY), 280000.00, 'activa', NOW(), NOW()),
(5, 6, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 180 DAY), 650000.00, 'activa', NOW(), NOW());

-- Atributos para departamentos
INSERT INTO `atributos` (`id`, `nombre`, `tipo`, `created_at`, `updated_at`) VALUES
(1, 'Piscina', 'boolean', NOW(), NOW()),
(2, 'Gimnasio', 'boolean', NOW(), NOW()),
(3, 'Seguridad 24h', 'boolean', NOW(), NOW()),
(4, 'Ascensor', 'boolean', NOW(), NOW()),
(5, 'Balcón', 'boolean', NOW(), NOW()),
(6, 'Terraza', 'boolean', NOW(), NOW()),
(7, 'Aire Acondicionado', 'boolean', NOW(), NOW()),
(8, 'Calefacción', 'boolean', NOW(), NOW());

-- Relaciones departamento-atributo
INSERT INTO `departamento_atributo` (`departamento_id`, `atributo_id`, `valor`, `created_at`, `updated_at`) VALUES
(1, 3, '1', NOW(), NOW()),
(1, 4, '1', NOW(), NOW()),
(1, 5, '1', NOW(), NOW()),
(2, 3, '1', NOW(), NOW()),
(2, 4, '1', NOW(), NOW()),
(3, 1, '1', NOW(), NOW()),
(3, 2, '1', NOW(), NOW()),
(3, 3, '1', NOW(), NOW()),
(3, 4, '1', NOW(), NOW()),
(3, 5, '1', NOW(), NOW()),
(3, 7, '1', NOW(), NOW()),
(4, 3, '1', NOW(), NOW()),
(4, 4, '1', NOW(), NOW()),
(4, 5, '1', NOW(), NOW()),
(5, 3, '1', NOW(), NOW()),
(5, 4, '1', NOW(), NOW()),
(6, 1, '1', NOW(), NOW()),
(6, 2, '1', NOW(), NOW()),
(6, 3, '1', NOW(), NOW()),
(6, 4, '1', NOW(), NOW()),
(6, 6, '1', NOW(), NOW()),
(6, 7, '1', NOW(), NOW()),
(6, 8, '1', NOW(), NOW());

-- Cotizaciones de ejemplo
INSERT INTO `cotizaciones` (`id`, `asesor_id`, `departamento_id`, `cliente_id`, `tipo_solicitud`, `mensaje_solicitud`, `telefono_contacto`, `tipo`, `mensaje`, `telefono`, `disponibilidad`, `preferencia_contacto`, `fecha`, `monto`, `descuento`, `estado`, `fecha_validez`, `notas`, `condiciones`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 'cotizacion', 'Estoy interesado en este departamento para compra', '987654321', 'cotizacion', 'Estoy interesado en este departamento para compra', '987654321', '{"dias_disponibles": ["lunes", "martes", "miercoles"], "horarios": ["mañana", "tarde"]}', 'telefono', NOW(), 245000.00, 2.00, 'pendiente', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'Cliente preaprobado por banco', 'Precio válido por 15 días. Incluye gastos notariales.', NOW(), NOW()),
(2, 1, 3, 2, 'visita', 'Quisiera agendar una visita para este fin de semana', '567890123', 'visita', 'Quisiera agendar una visita para este fin de semana', '567890123', '{"dias_disponibles": ["sabado", "domingo"], "horarios": ["mañana"]}', 'whatsapp', NOW(), 420000.00, 0.00, 'en_proceso', DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'Visita programada para sábado 10 AM', 'Precio de lista sin descuentos', NOW(), NOW()),
(3, 1, 6, 3, 'informacion', 'Necesito más información sobre amenities y financiamiento', '912345678', 'informacion', 'Necesito más información sobre amenities y financiamiento', '912345678', '{"dias_disponibles": ["lunes", "miercoles", "viernes"], "horarios": ["tarde"]}', 'email', NOW(), 630000.00, 3.08, 'pendiente', DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Cliente con alta capacidad de pago', 'Descuento especial por pronto pago', NOW(), NOW());

-- Reservas
INSERT INTO `reservas` (`id`, `cotizacion_id`, `cliente_id`, `asesor_id`, `departamento_id`, `fecha_reserva`, `fecha_inicio`, `fecha_fin`, `monto_reserva`, `monto_total`, `estado`, `notas`, `condiciones`, `created_at`, `updated_at`) VALUES
(1, NULL, 2, 1, 4, NOW(), CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 25000.00, 350000.00, 'activa', 'Reserva por 30 días mientras se tramita financiamiento', 'Apartado válido por 30 días. No reembolsable.', NOW(), NOW());

-- Favoritos
INSERT INTO `favoritos` (`cliente_id`, `departamento_id`, `created_at`, `updated_at`) VALUES
(1, 1, NOW(), NOW()),
(1, 3, NOW(), NOW()),
(2, 3, NOW(), NOW()),
(2, 6, NOW(), NOW()),
(3, 6, NOW(), NOW()),
(3, 1, NOW(), NOW());

-- Imágenes de ejemplo
INSERT INTO `imagenes` (`id`, `departamento_id`, `url`, `titulo`, `descripcion`, `tipo`, `orden`, `activa`, `created_at`, `updated_at`) VALUES
(1, 1, '/storage/images/dept001/principal.jpg', 'Vista principal', 'Sala de estar con vista panorámica', 'principal', 1, 1, NOW(), NOW()),
(2, 1, '/storage/images/dept001/cocina.jpg', 'Cocina equipada', 'Cocina moderna con electrodomésticos', 'galeria', 2, 1, NOW(), NOW()),
(3, 1, '/storage/images/dept001/dormitorio.jpg', 'Dormitorio principal', 'Amplio dormitorio con closet empotrado', 'galeria', 3, 1, NOW(), NOW()),
(4, 3, '/storage/images/dept003/principal.jpg', 'Vista principal', 'Sala con vista al mar', 'principal', 1, 1, NOW(), NOW()),
(5, 3, '/storage/images/dept003/terraza.jpg', 'Terraza', 'Terraza con vista panorámica', 'galeria', 2, 1, NOW(), NOW()),
(6, 6, '/storage/images/dept006/principal.jpg', 'Vista penthouse', 'Sala principal del penthouse', 'principal', 1, 1, NOW(), NOW()),
(7, 6, '/storage/images/dept006/terraza.jpg', 'Terraza privada', 'Terraza con jacuzzi privado', 'galeria', 2, 1, NOW(), NOW());

-- Comentarios en solicitudes
INSERT INTO `comentarios_solicitud` (`id`, `cotizacion_id`, `user_id`, `mensaje`, `rol`, `created_at`, `updated_at`) VALUES
(1, 1, 3, '¿El precio incluye gastos notariales?', 'cliente', NOW(), NOW()),
(2, 1, 2, 'Sí, el precio incluye gastos notariales y registrales', 'asesor', NOW(), NOW()),
(3, 2, 4, 'Confirmo disponibilidad para la visita del sábado', 'cliente', NOW(), NOW()),
(4, 3, 5, '¿Qué opciones de financiamiento están disponibles?', 'cliente', NOW(), NOW()),
(5, 3, 2, 'Tenemos convenios con 5 bancos principales. Te envío la información detallada.', 'asesor', NOW(), NOW());

-- Auditoría de usuarios
INSERT INTO `auditoria_usuarios` (`id`, `usuario_id`, `accion`, `detalles`, `fecha_hora`, `created_at`, `updated_at`) VALUES
(1, 1, 'login', '{"ip": "127.0.0.1", "user_agent": "Mozilla/5.0"}', NOW(), NOW(), NOW()),
(2, 2, 'login', '{"ip": "127.0.0.1", "user_agent": "Mozilla/5.0"}', NOW(), NOW(), NOW()),
(3, 3, 'registro_cliente', '{"metodo": "web", "origen": "catalogo"}', NOW(), NOW(), NOW()),
(4, 2, 'crear_cotizacion', '{"cotizacion_id": 1, "departamento_id": 1}', NOW(), NOW(), NOW()),
(5, 2, 'crear_reserva', '{"reserva_id": 1, "departamento_id": 4}', NOW(), NOW(), NOW());

COMMIT;
