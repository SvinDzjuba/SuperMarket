module.exports = app => {
    const controller = require('../../controllers/api/search.controller');
    const router = require('express').Router();
    app.use('/api/search', router);

    router.get('/product/shops/:product', controller.getShopsByProduct);
    app.use('/api/search/product/shops', router);

    router.get('/shop/employees/:id', controller.getShopEmployees);
    app.use('/api/search/shop/employees', router);

    router.post('/shop', controller.getShopByName);
    app.use('/api/search/shop', router);
}