// const jwt = require('jsonwebtoken');
// const config = require('../config/auth.config');
const User = require('../../models/user');
const Role = require('../../models/role');
const UserRoles = require('../../models/user_roles');

exports.changeUserRole = async (req, res) => {
    if(!req.body.roles) {
        return res.status(404).send({
            message: 'You must provide at least one role!'
        });
    }
    await UserRoles.destroy({
        where: {
            userId: req.userId,
        }
    });
    let rolesList = [];
    for (let i = 0; i < req.body.roles.length; i++) {   
        let role = await Role.findOne({
            where: { name: req.body.roles[i] }
        });
        if(role != null) {
            await UserRoles.create({
                userId: req.userId,
                roleId: role.id
            });
            rolesList.push(role.name.toUpperCase());
        } else {
            return res.status(404).send({
                message: `Unable to find role: ${req.body.roles[i]}!`
            });
        }
    }
    req.roles = rolesList;
    let response = {
        username: req.username,
        roles: rolesList
    }
    res.status(200).send(response);
    process.env.TOKEN = jwt.sign({ userId: user.id, roles: roles, username: req.body.username }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
    // process.env.TOKEN = undefined;
}