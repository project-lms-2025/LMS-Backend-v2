import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS Backend API',
      version: '1.0.0',
      description: 'API documentation for the LMS Backend',
    },
    servers: [
      {
        url: '/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;