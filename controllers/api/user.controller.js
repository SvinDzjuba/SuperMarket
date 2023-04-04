const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const User = require('../../models/user');
const Role = require('../../models/role');
const UserRoles = require('../../models/user_roles');

exports.changeUserRole = async (req, res) => {
    if(!req.body.roles || !req.body.userId) {
        return res.status(404).send({
            message: 'You must provide all required fields!'
        });
    } else if(req.body.roles.length == 0) {
        return res.status(404).send({
            message: 'You must provide at least one role!'
        });
    }

    let lowerRoles = req.body.roles.map(role => role.toLowerCase());
    if(req.body.userId == req.userId) {
        if(!lowerRoles.includes('admin')) {
            lowerRoles.push('admin');
        }
        if(lowerRoles.includes('user')) {
            // lowerRoles = lowerRoles.filter(role => role != 'user');
            return res.status(400).send({ 
                message: 'Admin cannot have the user role!' 
            });
        }
    } else {
        if(lowerRoles.includes('admin') && lowerRoles.includes('user')) {
            return res.status(400).send({ 
                message: 'User cannot have the roles of admin and user!' 
            });
        }
        if(lowerRoles.includes('user') && lowerRoles.includes('moderator')) {
            return res.status(400).send({ 
                message: 'User cannot have the roles of moderator and user!' 
            });
        }
    }

    await UserRoles.destroy({
        where: { userId: req.body.userId }
    });

    let rolesList = [];
    for (let i = 0; i < lowerRoles.length; i++) {   
        let role = await Role.findOne({
            where: { name: lowerRoles[i] }
        });
        if(role != null) {
            await UserRoles.findOrCreate({
                where: {
                    userId: req.body.userId,
                    roleId: role.id
                }
            });
            rolesList.push(role.name.toUpperCase());
        } else {
            return res.status(404).send({
                message: `Unable to find role: ${req.body.roles[i]}!`
            });
        }
    }

    await User.findOne({
        where: {
            id: req.body.userId,
        }
    }).then(user => {
        if(req.body.userId == req.userId) {
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    let role = roles[i].name;
                    roles[i].name = role.toUpperCase();
                }
                const token = jwt.sign(
                    { 
                        userId: user.id, roles: roles, 
                        username: user.username 
                    }, 
                    config.secret, { expiresIn: 86400 }
                );
                process.env.TOKEN = token;   
            });
        }
        res.status(200).send({
            username: user.username,
            roles: rolesList
        });
    });
}