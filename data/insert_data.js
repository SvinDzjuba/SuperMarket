const jsonData = require('./shops_data.json');
const Classification = require('../models/classification');
const Employee = require('../models/employee');
const Position = require('../models/position');
const Product = require('../models/product');
const Shop = require('../models/shop');
const ShopEmployee = require('../models/shop_employee');
const ShopProduct = require('../models/shop_product');

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
        // Find shop for its id
        let shop = await Shop.findOne({
            where: {
                name: data[i].name,
                address: data[i].address
            },
            attributes: ['id']
        });
        // Create shop if it doesn't exist
        if(shop == null) {
            shop = await Shop.create({
                name: data[i].name,
                address: data[i].address
            });
        }

        for (let j = 0; j < employees[i].length; j++) {
            // Find particular position id for product.position
            let position = await Position.findOne({
                where: { name: employees[i][j].position },
                attributes: ['id']
            });
            // Create employee if it doesn't exist
            await Employee.findOrCreate({
                where: {
                    fullName: employees[i][j].fullName,
                    age: employees[i][j].age,
                    position: position.id
                }
            });
            // Find employee id to create relation between shop and employee
            let employee = await Employee.findOne({
                where: {
                    fullName: employees[i][j].fullName,
                    age: employees[i][j].age,
                    position: position.id
                },
                attributes: ['id']
            })
            // Create relations between shop and employees
            await ShopEmployee.findOrCreate({
                where: {
                    shopId: shop.id,
                    employeeId: employee.id
                }
            });
        }

        for (let j = 0; j < products[i].length; j++) {
            // Find particular classification id for product.classification
            let classification = await Classification.findOne({
                where: { name: products[i][j].classification },
                attributes: ['id']
            });
            // Create product if it doesn't exist
            await Product.findOrCreate({
                where: {
                    name: products[i][j].name,
                    classification: classification.id,
                    price: products[i][j].price,
                    description: products[i][j].description,
                }
            });
            // Find product id to create relation between shop and product
            let product = await Product.findOne({
                where: {
                    name: products[i][j].name,
                    classification: classification.id,
                    price: products[i][j].price,
                    description: products[i][j].description,
                },
                attributes: ['id']
            })
            // Create relations between shop and products
            ShopProduct.findOrCreate({
                where: {
                    productId: product.id,
                    shopId: shop.id
                }
            });
        }
    }
}