# Gestión de Citas

Sistema web para la administración y gestión de citas médicas u hospitalarias. Este proyecto está dividido en dos partes principales: un backend robusto en Laravel y un frontend moderno en React con TypeScript.

## 🚀 Tecnologías Utilizadas

### Backend (API)

- **Framework**: Laravel 11
- **Lenguaje**: PHP 8.2+
- **Autenticación**: Laravel Sanctum
- **Base de Datos**: MySQL (Compatible con otros drivers soportados por Laravel)

### Frontend (Cliente)

- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Empaquetador**: Vite
- **Estilos**: (Consultar configuración de Tailwind/CSS en el proyecto)
- **Librerías clave**:
  - `react-router-dom`: Navegación
  - `axios`: Peticiones HTTP
  - `react-toastify`: Notificaciones
  - `jspdf` & `html2canvas`: Generación de reportes PDF

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- [PHP](https://www.php.net/) >= 8.2
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) (y npm)
- Un servidor de base de datos MySQL (ej. XAMPP, Laragon, MySQL Workbench)

## 🛠️ Instalación y Configuración

Sigue estos pasos para clonar y ejecutar el proyecto localmente.

### 1. Clonar el repositorio

```bash
git clone https://github.com/MiguelLope/GestionDeCitas.git
cd GestionDeCitas
```

### 2. Configuración del Backend (`/back`)

```bash
cd back
```

Instalar dependencias de PHP:

```bash
composer install
```

Configurar variables de entorno:

```bash
cp .env.example .env
```

_Abre el archivo `.env` y configura tus credenciales de base de datos (DB_DATABASE, DB_USERNAME, etc.)._

Generar clave de aplicación y migraciones:

```bash
php artisan key:generate
php artisan migrate
```

Iniciar servidor de desarrollo:

```bash
php artisan serve
```

_El backend estará corriendo en `http://localhost:8000`_

### 3. Configuración del Frontend (`/front`)

Abrir una nueva terminal y navegar a la carpeta del frontend:

```bash
cd front
```

Instalar dependencias de Node:

```bash
npm install
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

_El frontend estará disponible generalmente en `http://localhost:5173`_

## ✨ Funcionalidades Principales

- **Gestión de Citas**: Agendar, ver y cancelar citas.
- **Autenticación de Usuarios**: Login seguro.
- **Generación de Reportes**: Exportación de citas o datos a PDF.
- **Interfaz Reactiva**: Feedback inmediato al usuario mediante notificaciones toast.

## ✒️ Autores

- **Miguel Lopez** - _Trabajo Inicial_ - [MiguelLope](https://github.com/MiguelLope)
