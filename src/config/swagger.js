const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pahin API',
      version: '1.0.0',
      description: 'REST API for tree planting application',
    },
    servers: [
      {
        url: 'https://pahin-backend.onrender.com/api',
        description: 'Production',
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Local',
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
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
