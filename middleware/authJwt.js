const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

verifyToken = (req, res, next) => {
    var token = req.header['x-access-token'];

    if(!token) {
        return res.status(403).send({
            message: 'No token provided!'
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: 'Unauthorized!'
            });
        }
        req.uid = decoded.uid;
        req.roles = decoded.roles;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;