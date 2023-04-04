const User = require('../models/user');
const Role = require('../models/role');
const UserRoles = require('../models/user_roles');
var { sha1 } = require('sha1-hash-and-verify');

exports.createTestUsers = async () => {
    // User 1
    let [user] = await User.findOrCreate({
        where: {
            username: 'admin',
            password: sha1('12345'),
            email: 'admin@example.com',
            birthDate: '2000-12-22'
        }
    });
    let role = await Role.findOne({
        where: { name: 'admin' }
    })
    await UserRoles.findOrCreate({
        where: {
            userId: user.id,
            roleId: role.id
        }
    });

    // User 2
    [user] = await User.findOrCreate({
        where: {
            username: 'user',
            password: sha1('123'),
            email: 'user@example.com',
            birthDate: '2004-12-22'
        }
    });
    role = await Role.findOne({
        where: { name: 'user' }
    })
    await UserRoles.findOrCreate({
        where: {
            userId: user.id,
            roleId: role.id
        }
    });
}