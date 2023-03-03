const db = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

checkDuplicateUsername = (req, res, next) => {
    // Username
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Failed! Username is already in use!"
            });
            return;
        }
    });
}

checkRolesExisted = async (req, res, next) => {
    if(req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            const ROLE = await Role.findAll({
                where: {
                    name: req.body.roles[i]
                }
            })
            // if (!ROLE.includes(req.body.roles[i])) {
            //     res.status(400).send({
            //         message: "Failed! Role does not exist = " + req.body.roles[i]
            //     });
            //     return;
            // }
        }
    }
}