const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const User = require('../models/user');

verifyToken = (req, res, next) => {
    // var token = req.headers['x-access-token'];
    var token = process.env.TOKEN;

    if (!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
        // res.render('home', {
        //     username: undefined,
        //     roles: undefined
        // });
        return;
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.userId = decoded.userId;
        req.roles = decoded.roles;
        req.username = decoded.username;
        next();
    });
};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name === "admin") {
                    next();
                    return;
                }
            }

            res.status(403).send({
                message: "Require Admin Role!"
            });
            return;
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};

module.exports = authJwt;