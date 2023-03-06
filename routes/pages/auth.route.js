const { verifySignUp } = require('../../middleware');
const controller = require('../../controllers/logic/auth.controller');

module.exports = app => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Sign in
    app.get('/signin', (req, res) => {
        res.render('login');
    });
    app.post('/signin', controller.signIn);

    // Sign up
    app.get('/signup', (req, res) => {
        res.render('registration');
    });
    app.post(
        '/signup',
        [
            verifySignUp.checkDuplicateUsername,
            verifySignUp.checkRolesExisted
        ],
        controller.signUp
    );
};