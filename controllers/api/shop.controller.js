const Shop = require('../../models/shop');
const Type = require('../../models/type');
const Product = require('../../models/product');
const Position = require('../../models/position');
const Employee = require('../../models/employee');
const Classification = require('../../models/classification');
const ClassificationType = require('../../models/classification_type');
const ShopEmployee = require('../../models/shop_employee');
const ShopProduct = require('../../models/shop_product');

exports.findAll = async function (req, res) {
    let shops = [];
    let completed = 0;
    const data = await Shop.findAll()
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to get all shops!'
            });
        });
    if (data.length < 1) {
        res.status(404).send({
            message: 'Unable to get shops!'
        });
    }
    for (let i = 0; i < data.length; i++) {
        new Promise(async (resolve, reject) => {
            let employeesList = [];
            let productsList = [];
            // Shop employees
            const shop_employees = await ShopEmployee.findAll({ where: { shopId: data[i].id } });
            for (let i = 0; i < shop_employees.length; i++) {
                const shop_employee = await Employee.findOne({ where: { id: shop_employees[i].employeeId } });
                const position = await Position.findOne({
                    where: {
                        id: shop_employee.positionId
                    }
                });
                let employee = {
                    fullName: shop_employee.fullName,
                    position: position.name,
                    birthDate: shop_employee.birthDate,
                    enteredDate: shop_employee.enteredDate
                };
                employeesList.push(employee);
            }
            // Shop products
            const shop_products = await ShopProduct.findAll({ where: { shopId: data[i].id } })
            for (let j = 0; j < shop_products.length; j++) {
                const shop_product = await Product.findOne({ where: { id: shop_products[j].productId } });
                const classificationType = await ClassificationType.findOne({
                    where: {
                        id: shop_product.classificationTypeId
                    }
                });
                const classification = await Classification.findOne({
                    where: {
                        id: classificationType.classificationId
                    }
                });
                const type = await Type.findOne({
                    where: {
                        id: classificationType.typeId
                    }
                });
                let product = {
                    name: shop_product.name,
                    classification: {
                        name: classification.name,
                        type: type.name
                    },
                    price: shop_product.price
                }
                productsList.push(product);
            }
            let shop = {
                name: data[i].name,
                address: data[i].address,
                employees: employeesList,
                products: productsList
            };
            shops.push(shop);
            completed++;
            resolve(shops);
        }).then(shopsList => {
            if (completed == data.length) {
                res.send(shopsList);
            }
        })
    }
}

exports.create = async (req, res) => {
    if (!req.body.name || !req.body.address
        || !req.body.products || !req.body.employees) {
        res.status(404).send({
            message: 'You must provide all shop data!'
        });
        return;
    }
    const employees = req.body.employees;
    const products = req.body.products;
    // Find shop for its id
    let [shop, created] = await Shop.findOrCreate({
        where: {
            name: req.body.name,
            address: req.body.address
        },
        attributes: ['id']
    });
    if (!created && products.length == 0 && employees.length == 0) {
        res.status(200).send({ message: `Shop '${req.body.name}' is already exists!` });
        return;
    }
    for (let j = 0; j < employees.length; j++) {
        // Find particular position id for product.position
        let [position] = await Position.findOrCreate({
            where: { name: employees[j].position },
            attributes: ['id']
        });
        // Create employee if it doesn't exist
        let [employee] = await Employee.findOrCreate({
            where: {
                fullName: employees[j].fullName,
                birthDate: employees[j].birthDate,
                positionId: position.id,
                enteredDate: employees[j].enteredDate
            }
        });
        // Create relations between shop and employees
        await ShopEmployee.findOrCreate({
            where: {
                shopId: shop.id,
                employeeId: employee.id
            }
        });
    }

    for (let j = 0; j < products.length; j++) {
        // Find particular classification id for product.classification
        let [classification] = await Classification.findOrCreate({
            where: { name: products[j].classification.name },
            attributes: ['id']
        });
        let [type] = await Type.findOrCreate({
            where: { name: products[j].classification.type },
            attributes: ['id']
        });
        let [classificationType] = await ClassificationType.findOrCreate({
            where: {
                classificationId: classification.id,
                typeId: type.id
            },
            attributes: ['id']
        });
        // Create product if it doesn't exist
        let [product] = await Product.findOrCreate({
            where: {
                name: products[j].name,
                classificationTypeId: classificationType.id,
                price: products[j].price,
                description: products[j].description,
            }
        });
        // Create relations between shop and products
        await ShopProduct.findOrCreate({
            where: {
                productId: product.id,
                shopId: shop.id
            }
        });
    }
    res.status(201).send({ message: `Shop '${req.body.name}' was successfully added!` });
}

exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(404).send({
            message: 'You must provide a shop id!'
        });
        return;
    }
    Shop.destroy({
        where: { id: req.params.id }
    })
        .then(boolean => {
            if (boolean == 0) {
                res.status(404).send({ message: `There is no shop with [id: ${req.params.id}]!` });
                return;
            }
            res.status(200).send({ message: `Shop with [id: ${req.params.id}] was successfully deleted!` });
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Unable to delete shop!'
            });
        });
}

exports.update = async (req, res) => {
    if (!req.params.id) {
        res.status(404).send({
            message: 'You must provide the shop id!'
        });
        return;
    }
    await Shop.update(
        {
            name: req.body.name,
            address: req.body.address,
        },
        {
            where: {
                id: req.params.id,
            }
        }
    ).catch(err => {
        res.status(404).send({
            message: err.message || 'Unable to update shop!'
        });
        return;
    });
    const employees = req.body.employees;
    const products = req.body.products;
    if (employees != undefined) {
        for (let j = 0; j < employees.length; j++) {
            // Find particular position id for product.position
            let [position] = await Position.findOrCreate({
                where: { name: employees[j].position },
                attributes: ['id']
            });
            // Create employee if it doesn't exist
            let [employee] = await Employee.findOrCreate({
                where: {
                    fullName: employees[j].fullName,
                    birthDate: employees[j].birthDate,
                    positionId: position.id,
                    enteredDate: employees[j].enteredDate
                }
            });
            // Create relations between shop and employees
            await ShopEmployee.findOrCreate({
                where: {
                    shopId: shop.id,
                    employeeId: employee.id
                }
            });
        }
    }

    if (products != undefined) {
        for (let j = 0; j < products.length; j++) {
            // Find particular classification id for product.classification
            let [classification] = await Classification.findOrCreate({
                where: { name: products[j].classification.name },
                attributes: ['id']
            });
            let [type] = await Type.findOrCreate({
                where: { name: products[j].classification.type },
                attributes: ['id']
            });
            let [classificationType] = await ClassificationType.findOrCreate({
                where: {
                    classificationId: classification.id,
                    typeId: type.id
                },
                attributes: ['id']
            });
            // Create product if it doesn't exist
            let [product] = await Product.findOrCreate({
                where: {
                    name: products[j].name,
                    classificationTypeId: classificationType.id,
                    price: products[j].price,
                    description: products[j].description,
                }
            });
            // Create relations between shop and products
            await ShopProduct.findOrCreate({
                where: {
                    productId: product.id,
                    shopId: shop.id
                }
            });
        }
    }
    res.status(200).send({ message: 'Shop was successfully updated!' });
}