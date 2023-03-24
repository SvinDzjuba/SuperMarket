module.exports = app => {
    const controller = require('../../controllers/api/classification.controller');
    const router = require('express').Router();

    router.get('/', controller.findAll);
    router.post('/', controller.create);
    router.delete('/:id', controller.delete);
    router.put('/', controller.update);

    app.use('/api/classifications', router);
}