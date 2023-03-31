const { verifySignUp, authJwt } = require('../../middleware');
const accessController = require('../../controllers/logic/access.controller');
const controller = require('../../controllers/logic/auth.controller');

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post('/signin', controller.signIn);
    
    app.post(
        '/signup',
        [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkRolesExisted
        ],
        controller.signUp
    );
};