exports.createAllRoles = async () => {
    const Role = require('../models/role');
    await Role.findOrCreate({
        where: {
            name: 'user'
        }
    });
    await Role.findOrCreate({
        where: {
            name: 'moderator'
        }
    });
    await Role.findOrCreate({
        where: {
            name: 'admin'
        }
    });
}