module.exports = app => {
    const controller = require('../../controllers/api/shop.controller');
    const router = require('express').Router();

    router.get('/', controller.findAll);
    router.post('/', controller.create);
    router.delete('/:id', controller.delete);
    router.put('/:id', controller.update);

    app.use('/api/shops', router);
}