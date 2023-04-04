const dataClassificationType = require('./data.classification_type');
const dataPosition = require('./data.position');
const dataUser = require('./data.user');
const dataShop = require('./data.shop');
const dataRole = require('./data.role');

module.exports = {
    createAllClassificationsAndTypes: dataClassificationType.createAllClassificationsAndTypes,
    createShopsAndRelated: dataShop.createShopsAndRelated,
    createAllPositions: dataPosition.createAllPositions,
    createAllRoles: dataRole.createAllRoles,
    createTestUsers: dataUser.createTestUsers
};