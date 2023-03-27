const User = require('../models/user');
const Role = require('../models/role');
const UserRoles = require('../models/user_roles');
var { sha1 } = require('sha1-hash-and-verify');

exports.createTestUser = async () => {
    const [user] = await User.findOrCreate({
        where: {
            username: 'admin',
            password: sha1('12345'),
            email: 'admin@example.com',
            birthDate: '2000-12-22'
        }
    });
    const role = await Role.findOne({
        where: { name: 'admin' }
    })
    await UserRoles.findOrCreate({
        where: {
            userId: user.id,
            roleId: role.id
        }
    })
}