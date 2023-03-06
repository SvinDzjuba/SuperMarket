const jsonData = require('./data.shops.json');
const dataController = require('./');

module.exports.insertData = async () => {
    const jsonStr = JSON.stringify(jsonData);
    const data = await JSON.parse(jsonStr);

    dataController.createAllPositions(data);
    dataController.createAllClassificationsAndTypes(data);
    dataController.createShopsAndRelated(data);
}