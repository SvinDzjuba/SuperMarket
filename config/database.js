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
}