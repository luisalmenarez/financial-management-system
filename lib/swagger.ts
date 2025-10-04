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
  },
  apis: ['./pages/api/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
