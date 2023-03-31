module.exports = app => {
    const controller = require('../../controllers/api/search.controller');
    const router = require('express').Router();
    app.use('/api/search', router);

    router.get('/product/shops/:product', controller.getShopsByProduct);
    app.use('/api/search/product/shops', router);

    router.get('/shop/employees/:shop', controller.getShopEmployees);
    app.use('/api/search/shop/employees', router);

    router.get('/shop/:name', controller.getShopByName);
    app.use('/api/search/shop', router);

    router.get('/products/:type', controller.getProductsByType);
    app.use('/api/search/products', router);

    router.get('/employees/:position', controller.getAllEmployeesByPosition);
    app.use('/api/search/employees', router);
}