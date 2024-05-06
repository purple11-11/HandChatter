const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        info: {
            title: "Test API",
            version: "1.0.0",
            description: "Test API with express",
        },
        servers: [
            {
                description: "test 중입니다.",
                url: "localhost:8080",
            },
        ],
        host: `localhost:${process.env.PORT}`,
        basePath: "/",
    },
    apis: ["./routes/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs,
};
