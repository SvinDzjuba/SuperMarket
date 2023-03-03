const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const { db } = require('../config/database');
const User = require('../models/user');

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

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
        erq.userId = decoded.id;
        next();
    });
}