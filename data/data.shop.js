exports.createShopsAndRelated = async (data) => {
    const Classification = require('../models/classification');
    const Type = require('../models/type');
    const ClassificationType = require('../models/classification_type');
    const Employee = require('../models/employee');
    const Position = require('../models/position');
    const Product = require('../models/product');
    const Shop = require('../models/shop');
    const ShopEmployee = require('../models/shop_employee');
    const ShopProduct = require('../models/shop_product');

    const employees = data.map(shop => shop.employees);
    const products = data.map(shop => shop.products);

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
                    birthDate: employees[i][j].birthDate,
                    position: position.id,
                    enteredDate: employees[i][j].enteredDate
                }
            });
            // Find employee id to create relation between shop and employee
            let employee = await Employee.findOne({
                where: {
                    fullName: employees[i][j].fullName,
                    birthDate: employees[i][j].birthDate,
                    position: position.id,
                    enteredDate: employees[i][j].enteredDate
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
                where: { name: products[i][j].classification.name },
                attributes: ['id']
            });
            let type = await Type.findOne({
                where: { name: products[i][j].classification.type },
                attributes: ['id']
            });
            let classificationType = await ClassificationType.findOne({
                where: { 
                    classificationId: classification.id,
                    typeId: type.id
                },
                attributes: ['id']
            });
            // Create product if it doesn't exist
            await Product.findOrCreate({
                where: {
                    name: products[i][j].name,
                    classificationType: classificationType.id,
                    price: products[i][j].price,
                    description: products[i][j].description,
                }
            });
            // Find product id to create relation between shop and product
            let product = await Product.findOne({
                where: {
                    name: products[i][j].name,
                    classificationType: classificationType.id,
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