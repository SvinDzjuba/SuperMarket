const { authJwt } = require('../../middleware');
const controller = require('../../controllers/logic/access.controller');

module.exports = app => {
    const router = require('express').Router();
    
    router.get('/', [authJwt.verifyToken], controller.checkAccess);
    app.use('/api/access', router);
}
