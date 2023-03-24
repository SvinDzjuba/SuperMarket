module.exports = function initSwagger(app) {
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const docs = require('./swagger.docs.json');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));
}