const { Sequelize } = require('sequelize')
const mysql = require('mysql2');

module.exports.dbInit = async function dbInit() {
    // Create connection to MySQL
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });

    // Create database if not exist
    connection.query(`CREATE DATABASE IF NOT EXISTS SupermarketDB`);

    // Close the connection
    connection.end();

    // Create sequelize connection
    const sequelize = new Sequelize('SupermarketDB', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });
    sequelize.sync({ alter: true });
    module.exports.db = sequelize;
}

module.exports.configureDb = function configureDb() {

    let Shop = require('../models/shop');
    let Classification = require('../models/classification');
    let Position = require('../models/position');
    let Product = require('../models/product');
    let Employee = require('../models/employee');
    let ShopEmployee = require('../models/shop_employee');
    let ShopProduct = require('../models/shop_product');

    Shop.belongsToMany(Product, { through: ShopProduct });
    Product.belongsToMany(Shop, { through: ShopProduct });
    // ---------------------------------------------------
    Shop.belongsToMany(Employee, { through: ShopEmployee });
    Employee.belongsToMany(Shop, { through: ShopEmployee });
}