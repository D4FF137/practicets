import swaggerJsdoc from 'swagger-jsdoc';
import { PORT } from "./env"

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API для пансионата',
      version: '1.0.0',
      description: '',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // Укажите базовый URL вашего сервера
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Укажите путь к вашим маршрутам
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;