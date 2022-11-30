const jsonData = require('./shops_data.json');
const Classification = require('../models/classification');
const Employee = require('../models/employee');
const Position = require('../models/position');
const Product = require('../models/product');
const Shop = require('../models/shop');

module.exports.insertData = async () => {
    const jsonStr = JSON.stringify(jsonData);
    const data = await JSON.parse(jsonStr);

    const employees = data.map(shop => shop.employees);
    const products = data.map(shop => shop.products);

    // Create all positions
    for (let i = 0; i < employees.length; i++) {
        let employee = employees[i];
        for (let j = 0; j < employee.length; j++) {
            await Position.findOrCreate({
                where: { name: employee[j].position },
            });
        }
    }
    // Create all classifications
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        for (let j = 0; j < product.length; j++) {
            await Classification.findOrCreate({
                where: { name: product[j].classification },
            });
        }
    }

    for (let i = 0; i < data.length; i++) {
        // Find all positions
        for (let j = 0; j < employees[i].length; j++) {
            let position = await Position.findOne({
                where: { name: employees[i][j].position },
                attributes: ['id']
            });
            await Employee.findOrCreate({
                where: {
                    fullName: employees[i][j].fullName,
                    age: employees[i][j].age,
                    position: position.id
                }
            });
        }

        // Find all classifications
        for (let j = 0; j < products[i].length; j++) {
            let classification = await Classification.findOne({
                where: { name: products[i][j].classification },
                attributes: ['id']
            });
            await Product.findOrCreate({
                where: {
                    name: products[i][j].name,
                    classification: classification.id,
                    price: products[i][j].price,
                    description: products[i][j].description,
                }
            });
        }
    }
}