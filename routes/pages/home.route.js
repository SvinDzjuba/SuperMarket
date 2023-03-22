const { authJwt } = require('../../middleware');
const controller = require('../../controllers/logic/access.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get('/', [authJwt.verifyToken], controller.allAccess);
    // app.get('/', [authJwt.verifyToken], async (req, res) => {
    //     res.render('home', {
    //         username: req.username
    //     })
    // });
};