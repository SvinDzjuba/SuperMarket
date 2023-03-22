const { authJwt } = require('../../middleware');
const { db } = require('../../config/database');
const config = require('../../config/auth.config');
const UserRoles = require('../../models/user_roles');
const User = require('../../models/user');
const Role = require('../../models/role');
const { Op } = require('sequelize');


var jwt = require('jsonwebtoken');
var { sha1, verifyHash } = require('sha1-hash-and-verify');

exports.signUp = (req, res) => {
    User.create({
        username: req.body.username,
        password: sha1(req.body.password),
        email: req.body.email,
        birthDate: req.body.birthdate === undefined ? req.body.birthdate : null,
        phone: req.body.phone === undefined ? req.body.phone : '',
    })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: 'User was registered successfully!' });
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    // res.send({ message: 'User was registered successfully!' });
                    res.redirect('/signin');
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signIn = async (req, res) => {
    User.findOne({
        where: {
            username: req.body.username,
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User Not found.' });
            }

            var passwordIsValid = verifyHash(req.body.password, user.password);

            if (passwordIsValid != true) {
                return res.status(401).send({
                    accessToken: null,
                    message: 'Invalid Password!'
                });
            }

            user.getRoles().then(roles => {
                const token = jwt.sign({ uid: user.id, roles: roles }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                
                var authorities = [];
                user.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        authorities.push("ROLE_" + roles[i].name.toUpperCase());
                    }
                    // res.status(200).redirect('/');

                    // res.status(200).render('home', {
                    //     username: user.username,
                    //     email: user.email,
                    // });
                    
                    res.status(200).send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: authorities,
                        accessToken: token
                    });
                });
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};