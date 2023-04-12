const Shop = require('../../models/shop');
const Type = require('../../models/type');
const Product = require('../../models/product');
const Position = require('../../models/position');
const Employee = require('../../models/employee');
const Classification = require('../../models/classification');
const ClassificationType = require('../../models/classification_type');
const ShopEmployee = require('../../models/shop_employee');
const ShopProduct = require('../../models/shop_product');
const { Op, QueryTypes } = require('sequelize');
const { db } = require('../../config/database');

exports.getShopsByProduct = async function (req, res) {
    if(!req.params.product) {
        res.status(404).send({ message: 'You must provide a product!' });
        return;
    }
    let reqProduct = req.params.product.charAt(0).toUpperCase() + req.params.product.slice(1);
    const products = await db.query(
        `SELECT * FROM products WHERE lower(name) LIKE '%${req.params.product}%'`,
        { type: QueryTypes.SELECT }
    );
    if(products.length == 0) {
        res.status(404).send({ 
            message: `There is no products with name: '${req.params.product}'`
        });
        return;
    }
    let data = {
        product: req.params.product,
        shops: []
    };
    let shops = [];
    for (let i = 0; i < products.length; i++) {
        let product_shop = await db.query(
            `SELECT shops.name, shops.address FROM shop_products AS shop_products, shops AS shops 
                WHERE shop_products.productId = ${products[i].id} AND shops.id = shop_products.shopId`,
            { type: QueryTypes.SELECT }
        );
        for (let j = 0; j < product_shop.length; j++) {
            shops.push(product_shop[j]);
        }
    }
    const addresses = shops.map(el => el.address)
    data.shops = shops.filter(({ address }, index) => !addresses.includes(address, index + 1))
    res.status(200).send(data);
};

exports.getShopByName = async function (req, res) {
    if(!req.params.name) {
        res.status(404).send({ message: 'You must provide a shop name' });
        return;
    }
    const shops = await Shop.findAll({
        where: {
            name: req.params.name
        }
    });
    if(shops.length == 0) {
        res.status(404).send({ message: 'Unable to get shops by this name' });
        return;
    }
    res.status(200).send(shops);
};

exports.getShopEmployees = async function (req, res) {
    if(!req.params.shop) {
        res.status(404).send({ message: 'You must provide a shop id' });
        return;
    }
    const shop = await Shop.findOne({
        where: { name: req.params.shop }
    });
    if(shop == null) {
        res.status(404).send({ 
            message: `Unable to get shop with name: ${req.params.shop}` 
        });
        return;
    }
    const shop_employees = await ShopEmployee.findAll({
        where: {
            shopId: shop.id
        }
    });
    if(shop_employees.length == 0) {
        res.status(404).send({ message: 'Unable to get shop employees' });
        return;
    }
    let employees = [];
    for (let i = 0; i < shop_employees.length; i++) {
        let employee = await Employee.findOne({
            where: {
                id: shop_employees[i].employeeId
            }
        });
        if(employee != null) {
            let position = await Position.findOne({
                where: {
                    id: employee.positionId
                }
            });
            employee = {
                fullName: employee.fullName,
                birthDate: employee.birthDate,
                enteredDate: employee.enteredDate,
                position: position.name
            }
            employees.push(employee);
        }
    }
    res.status(200).send(employees);
};

exports.getProductsByType = async function (req, res) {
    if(!req.params.type) {
        res.status(404).send({ message: 'You must provide a product type!' });
        return;
    }
    req.params.type = req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
    const type = await Type.findOne({
        where: {
            name: req.params.type
        }
    });
    if(type == null) {
        res.status(404).send({ message: `Unable to find products by type '${req.params.type}'` });
        return;
    }
    let products = [];
    const classificationType = await ClassificationType.findAll({
        where: {
            typeId: type.id
        }
    });
    for (let i = 0; i < classificationType.length; i++) {
        let productsList = await Product.findAll({
            where: {
                classificationTypeId: classificationType[i].id
            }
        });
        if(productsList != null) {
            let classification = await Classification.findOne({
                where: {
                    id: classificationType[i].classificationId
                }
            });
            for (let j = 0; j < productsList.length; j++) {
                let product = {
                    name: productsList[j].name,
                    price: productsList[j].price,
                    description: productsList[j].description,
                    classification: {
                        name: classification.name,
                        type: req.params.type
                    },
                }
                products.push(product);
            }
        }
    }
    res.status(200).send(products);
};

exports.getAllEmployeesByPosition = async (req, res) => {
    if(!req.params.position) {
        res.status(404).send({ message: 'You muse provide a position name!' });
        return;
    }
    req.params.position = req.params.position.toUpperCase();
    const position = await Position.findOne({
        where: { name: req.params.position }
    });
    if(position == null) {
        res.status(404).send({ 
            message: `Unable to find employees by position [${req.params.position}]` 
        });
        return;
    }
    const employees = await Employee.findAll({
        where: {
            positionId: position.id
        },
        attributes: ['id', 'fullName', 'birthDate', 'enteredDate']
    });
    if(employees.length == 0) {
        res.status(404).send({
            message: 'Unable to find employees by this position!'
        });
        return;
    }
    const response = {
        position: req.params.position,
        employees: []
    }
    response.employees = employees;
    res.status(200).send(response);
}