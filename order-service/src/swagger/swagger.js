const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API documentation for Order Service"
    },

    servers: [
      {
        url: "http://localhost:3002"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: [
    "./src/routes/*.js",
    "./src/models/*.js"
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;