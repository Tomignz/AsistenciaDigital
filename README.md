# Asistencia Digital

Aplicación para gestión de asistencias con roles de **administrador** y **profesor**. El frontend está construido con React y Tailwind CSS y el backend con Node.js, Express y MongoDB.

## Configuración

1. Copia los archivos de ejemplo de variables de entorno y ajusta según corresponda:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Edita `backend/.env` para definir la conexión a MongoDB, la clave JWT y el origen permitido de CORS:

```
PORT=3000
MONGODB_URI=mongodb://usuario:user.75%23@186.123.145.79:3969/asistencia-back
JWT_SECRET=alguna_clave_segura
CORS_ORIGIN=http://localhost:5173
```

3. En `frontend/.env` ajusta la URL del backend (por defecto apunta al servidor anterior):

```
VITE_API_URL=http://186.123.145.79:3969
```

## Uso en desarrollo

Instala las dependencias y levanta cada servicio en su carpeta respectiva.

```bash
cd backend
npm install
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible por defecto en `http://localhost:5173` y el backend en `http://localhost:3000` (o el puerto configurado).

## Compilación para producción

Para generar la versión optimizada del frontend:

```bash
cd frontend
npm run build
```

Los archivos resultantes estarán en `frontend/dist`. Pueden servirse con cualquier hosting estático o configurarse en el backend para servirlos.

## Funcionalidades principales

- Autenticación con JWT y roles de usuario (administrador y profesor).
- Registro y listado de asistencias manuales o mediante código QR.
- Panel para administradores y profesores protegido por token.
- Gestión de usuarios y asignaturas desde el panel de administración.
- Conexión a MongoDB configurable mediante variables de entorno.

La aplicación puede desplegarse en cualquier servidor Node.js con acceso a la base de datos especificada en las variables de entorno.
