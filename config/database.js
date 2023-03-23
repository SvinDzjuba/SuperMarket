const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

module.exports.createDb = async function createDb() {
    // Create connection to MySQL
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: ''
    });
    
    // Create database if not exist
    connection.query('SHOW DATABASES WHERE `database` = "SupermarketDB"', 
        function(err, result) {
            if(result.length != 0) {
                // Database already created
                console.log('The database has already been created!');
                createSeqConnection();
            } else {
                // Database not created yet 
                connection.query(`CREATE DATABASE SupermarketDB CHARACTER SET utf8 COLLATE utf8_general_ci`, 
                    function(err, result) {
                        if(err == null) {
                            createSeqConnection();
                        } else {
                            console.log('An error occurred while creating the database!');
                        }
                    });
            }
        });

    // Close the connection
    setTimeout(() => { connection.end() }, 2000);
}

// Create sequelize connection
function createSeqConnection() {
    const sequelize = new Sequelize('SupermarketDB', 'root', '', {
        host: 'localhost',
        dialect: 'mysql'
    });
    module.exports.db = sequelize;
}