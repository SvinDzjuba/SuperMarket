module.exports = app => {
    const controller = require('../../../controllers/api/search.controller');
    const router = require('express').Router();

    router.get('/:product', controller.getShopsByProduct);

    app.use('/api/search/shops-by-product', router);
}