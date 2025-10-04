# Sistema de Gestión de Ingresos y Egresos

Sistema fullstack de gestión financiera con autenticación, control de acceso basado en roles (RBAC) y generación de reportes.

## 🚀 Demo

- **URL de producción:** [Próximamente en Vercel]
- **Documentación API:** `/api-docs` - Interfaz Swagger UI
- **Especificación OpenAPI:** `/api/docs` - JSON spec

## 📋 Descripción

Sistema completo de gestión de ingresos y egresos que permite a los administradores gestionar movimientos financieros, usuarios y generar reportes con visualizaciones y exportación a CSV.

### Características Principales

- ✅ Autenticación con GitHub mediante Better Auth
- ✅ Control de acceso basado en roles (USER/ADMIN)
- ✅ Gestión de transacciones (ingresos/egresos)
- ✅ Administración de usuarios
- ✅ Reportes con gráficos interactivos
- ✅ Exportación de datos a CSV
- ✅ API REST completamente documentada con Swagger/OpenAPI
- ✅ Pruebas unitarias con Jest
- ✅ UI moderna con Tailwind CSS y Shadcn

## 🛠️ Stack Tecnológico

### Frontend

- **Framework:** Next.js 15 (Pages Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Componentes UI:** Shadcn/ui + Radix UI
- **Iconos:** Lucide React
- **Gráficos:** Recharts

### Backend

- **Runtime:** Node.js
- **API:** Next.js API Routes
- **Base de datos:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Autenticación:** Better Auth
- **Documentación:** Swagger/OpenAPI

### Testing

- **Framework:** Jest
- **Testing Library:** React Testing Library

## 📦 Instalación y Configuración

### Prerequisitos

- Node.js 18+ o 20+ (recomendado)
- PostgreSQL (o cuenta de Supabase)
- Cuenta de GitHub (para OAuth)

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd prueba-tecnica-fullstack
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# Better Auth - GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# App Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_key_here_change_in_production
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

#### Obtener credenciales de GitHub OAuth:

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click en "New OAuth App"
3. Configura:
   - **Application name:** Sistema Gestión Financiera
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copia el Client ID y genera un Client Secret

### 4. Configurar la base de datos

```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver los datos
npx prisma studio
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch
```

## 📚 Estructura del Proyecto

```
├── __tests__/              # Pruebas unitarias
│   ├── api-validation.test.ts
│   ├── components.test.tsx
│   └── utils.test.ts
├── components/
│   └── ui/                 # Componentes UI (Shadcn)
├── lib/
│   ├── auth/              # Configuración de Better Auth
│   │   ├── client.ts      # Cliente de autenticación
│   │   ├── index.ts       # Servidor de autenticación
│   │   └── middleware.ts  # Middleware RBAC
│   ├── prisma.ts          # Cliente de Prisma
│   ├── swagger.ts         # Configuración Swagger
│   └── utils.ts           # Utilidades
├── pages/
│   ├── api/
│   │   ├── auth/          # Endpoints de autenticación
│   │   ├── transactions/  # CRUD de transacciones
│   │   ├── users/         # Gestión de usuarios
│   │   ├── reports/       # Reportes y exportación
│   │   └── docs.ts        # Especificación OpenAPI
│   ├── index.tsx          # Home con menú principal
│   ├── login.tsx          # Página de login
│   ├── transactions.tsx   # Gestión de transacciones
│   ├── users.tsx          # Gestión de usuarios (Admin)
│   ├── reports.tsx        # Reportes y gráficos (Admin)
│   └── api-docs.tsx       # Documentación Swagger UI
├── prisma/
│   └── schema.prisma      # Esquema de base de datos
└── styles/                # Estilos globales
```

## 🔐 Roles y Permisos

### USER

- ✅ Ver transacciones
- ❌ Crear/editar transacciones
- ❌ Gestionar usuarios
- ❌ Ver reportes

### ADMIN

- ✅ Ver transacciones
- ✅ Crear/editar/eliminar transacciones
- ✅ Gestionar usuarios
- ✅ Ver reportes
- ✅ Exportar datos a CSV

**Nota:** Todos los nuevos usuarios se asignan automáticamente como ADMIN para facilitar las pruebas.

## 🌐 API Endpoints

### Autenticación

- `POST /api/auth/signin` - Iniciar sesión
- `POST /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Transacciones

- `GET /api/transactions` - Listar todas las transacciones
- `POST /api/transactions` - Crear transacción (Admin)
- `PUT /api/transactions/[id]` - Actualizar transacción (Admin)
- `DELETE /api/transactions/[id]` - Eliminar transacción (Admin)

### Usuarios

- `GET /api/users` - Listar usuarios (Admin)
- `PUT /api/users/[id]` - Actualizar usuario (Admin)

### Reportes

- `GET /api/reports` - Obtener datos del reporte (Admin)
- `GET /api/reports/export` - Exportar reporte CSV (Admin)

### Documentación

- `GET /api/docs` - Especificación OpenAPI JSON
- `/api-docs` - Interfaz Swagger UI

## 🚀 Despliegue en Vercel

### 1. Preparar el proyecto

```bash
# Verificar que el build funciona
npm run build
```

### 2. Configurar Vercel

1. Instalar Vercel CLI (opcional):

```bash
npm i -g vercel
```

2. Desde el dashboard de Vercel:
   - Importar el repositorio de GitHub
   - Configurar las variables de entorno:
     - `DATABASE_URL`
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`
     - `BETTER_AUTH_SECRET`
     - `BETTER_AUTH_URL` (URL de producción)
     - `NEXT_PUBLIC_BETTER_AUTH_URL` (URL de producción)

3. Actualizar GitHub OAuth:
   - Authorization callback URL: `https://tu-app.vercel.app/api/auth/callback/github`

### 3. Deploy

```bash
vercel --prod
```

## 🧩 Modelos de Datos

### User

- id, name, email, role, phone
- Relaciones: sessions, accounts, transactions

### Transaction

- id, concept, amount, date, type (INCOME/EXPENSE)
- Relación: user

### Session

- Gestión de sesiones de Better Auth

## 📝 Notas de Implementación

- **Asignación automática de rol ADMIN:** Configurado en `lib/auth/index.ts`
- **RBAC:** Implementado con middlewares `withAuth` y `withAdmin`
- **Validaciones:** Validación de datos en endpoints API
- **Seguridad:** Autenticación requerida para todos los endpoints
- **Documentación:** Cada endpoint documentado con JSDoc y Swagger

## 🐛 Solución de Problemas

### Error de migración de Prisma

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error de autenticación

- Verificar variables de entorno
- Confirmar credenciales de GitHub OAuth
- Revisar callback URL

### Error de build

```bash
rm -rf .next node_modules
npm install
npm run build
```
