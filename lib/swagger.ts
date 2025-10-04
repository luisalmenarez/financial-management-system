import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestión de Ingresos y Egresos API',
      version: '1.0.0',
      description:
        'API REST para el sistema de gestión de ingresos y egresos con autenticación y control de acceso basado en roles.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        description: process.env.NEXT_PUBLIC_APP_URL
          ? 'Servidor de producción'
          : 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token de autenticación de Better Auth',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Transactions',
        description:
          'Endpoints para gestión de transacciones (ingresos y egresos)',
      },
      {
        name: 'Users',
        description:
          'Endpoints para gestión de usuarios (solo administradores)',
      },
      {
        name: 'Reports',
        description:
          'Endpoints para reportes y exportación (solo administradores)',
      },
    ],
    paths: {
      '/api/transactions': {
        get: {
          summary: 'Obtener todas las transacciones',
          description:
            'Retorna la lista de todas las transacciones (ingresos y egresos) del sistema',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': { description: 'Lista de transacciones' },
            '401': { description: 'No autorizado' },
          },
        },
        post: {
          summary: 'Crear nueva transacción',
          description: 'Crea un nuevo ingreso o egreso (solo administradores)',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['concept', 'amount', 'date', 'type'],
                  properties: {
                    concept: { type: 'string' },
                    amount: { type: 'number' },
                    date: { type: 'string', format: 'date-time' },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Transacción creada exitosamente' },
            '400': { description: 'Datos inválidos' },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
          },
        },
      },
      '/api/transactions/{id}': {
        put: {
          summary: 'Actualizar transacción',
          description:
            'Actualiza una transacción existente (solo administradores)',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    concept: { type: 'string' },
                    amount: { type: 'number' },
                    date: { type: 'string', format: 'date-time' },
                    type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Transacción actualizada' },
            '400': { description: 'Datos inválidos' },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
            '404': { description: 'Transacción no encontrada' },
          },
        },
        delete: {
          summary: 'Eliminar transacción',
          description: 'Elimina una transacción (solo administradores)',
          tags: ['Transactions'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Transacción eliminada' },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
            '404': { description: 'Transacción no encontrada' },
          },
        },
      },
      '/api/users': {
        get: {
          summary: 'Obtener todos los usuarios',
          description:
            'Retorna la lista de todos los usuarios registrados (solo administradores)',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Lista de usuarios',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string', enum: ['USER', 'ADMIN'] },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
          },
        },
      },
      '/api/users/{id}': {
        put: {
          summary: 'Actualizar usuario',
          description:
            'Actualiza el nombre y/o rol de un usuario (solo administradores)',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'] },
                    phone: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Usuario actualizado' },
            '400': { description: 'Datos inválidos' },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
            '404': { description: 'Usuario no encontrado' },
          },
        },
      },
      '/api/reports': {
        get: {
          summary: 'Obtener reporte financiero',
          description:
            'Retorna datos para el reporte de movimientos financieros (solo administradores)',
          tags: ['Reports'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Datos del reporte',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalIncome: { type: 'number' },
                      totalExpense: { type: 'number' },
                      balance: { type: 'number' },
                      transactions: {
                        type: 'array',
                        items: { type: 'object' },
                      },
                      monthlyData: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            month: { type: 'string' },
                            income: { type: 'number' },
                            expense: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
          },
        },
      },
      '/api/reports/export': {
        get: {
          summary: 'Exportar reporte a CSV',
          description:
            'Descarga el reporte de transacciones en formato CSV (solo administradores)',
          tags: ['Reports'],
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Archivo CSV',
              content: {
                'text/csv': {
                  schema: { type: 'string' },
                },
              },
            },
            '401': { description: 'No autorizado' },
            '403': { description: 'Acceso denegado' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
