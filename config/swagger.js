import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LMS Backend API",
      version: "1.0.0",
      description: "API documentation for the LMS Backend",
    },
    servers: [
      {
        url: "/api", // URL of your API
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Optional, to specify the token format
        },
      },
    },
    security: [
      {
        BearerAuth: [], // This will require Bearer token authentication globally for all routes
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
