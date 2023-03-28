const jsonData = require('./data.shops.json');
const dataController = require('./');

module.exports.insertData = async () => {
    const jsonStr = JSON.stringify(jsonData);
    const data = await JSON.parse(jsonStr);

    await dataController.createAllPositions(data);
    await dataController.createAllClassificationsAndTypes(data);
    await dataController.createShopsAndRelated(data);
    await dataController.createAllRoles();
    await dataController.createTestUser();

    const PORT = process.env.PORT || 3000;
    console.log(`\n-- Everything is fine! You can use the app on [PORT: ${PORT}] --`);
}