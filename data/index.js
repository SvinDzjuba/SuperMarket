const dataPosition = require('./data.position');
const dataShop = require('./data.shop');
const dataRole = require('./data.role');
const dataClassificationType = require('./data.classification_type');

module.exports = {
    createAllClassificationsAndTypes: dataClassificationType.createAllClassificationsAndTypes,
    createShopsAndRelated: dataShop.createShopsAndRelated,
    createAllPositions: dataPosition.createAllPositions,
    createAllRoles: dataRole.createAllRoles
};