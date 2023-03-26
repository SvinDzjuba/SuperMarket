module.exports = app => {
    const controller = require('../../../controllers/api/search.controller');
    const router = require('express').Router();

    router.get('/:id', controller.getShopEmployees);

    app.use('/api/search/shop/employees', router);
}