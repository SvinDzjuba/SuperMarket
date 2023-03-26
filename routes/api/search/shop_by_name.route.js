module.exports = app => {
    const controller = require('../../../controllers/api/search.controller');
    const router = require('express').Router();

    router.post('/', controller.getShopByName);

    app.use('/api/search/shop', router);
}