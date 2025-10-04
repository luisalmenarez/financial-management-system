export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Sistema de Gestión de Ingresos y Egresos API',
    version: '1.0.0',
    description: 'API REST para el sistema de gestión financiera',
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
      description: 'Servidor API',
    },
  ],
  paths: {
    '/api/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Obtener todas las transacciones',
        responses: {
          '200': { description: 'Lista de transacciones' },
        },
      },
      post: {
        tags: ['Transactions'],
        summary: 'Crear nueva transacción',
        responses: {
          '201': { description: 'Transacción creada' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Obtener todos los usuarios',
        responses: {
          '200': { description: 'Lista de usuarios' },
        },
      },
    },
    '/api/reports': {
      get: {
        tags: ['Reports'],
        summary: 'Obtener reporte financiero',
        responses: {
          '200': { description: 'Datos del reporte' },
        },
      },
    },
  },
};
