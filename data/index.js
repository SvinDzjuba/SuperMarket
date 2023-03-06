const dataPosition = require('./data.position');
const dataShop = require('./data.shop');
const dataClassificationType = require('./data.classification_type');

module.exports = {
    createAllClassificationsAndTypes: dataClassificationType.createAllClassificationsAndTypes,
    createShopsAndRelated: dataShop.createShopsAndRelated,
    createAllPositions: dataPosition.createAllPositions
};