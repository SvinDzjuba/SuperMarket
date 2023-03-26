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
}