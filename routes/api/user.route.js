const { authJwt } = require('../../middleware');
const accessController = require('../../controllers/logic/access.controller');
const controller = require('../../controllers/api/user.controller');

module.exports = app => {
    const router = require('express').Router();
    
    router.get('/', [authJwt.verifyToken], accessController.checkAccess);
    app.use('/api/access', router);
    
    router.put(
        '/', 
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ], 
        controller.changeUserRole
    );
    app.use('/api/user/roles', router);
}
