const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const Shop = require('./shop');
const Employee = require('./employee');

class ShopEmployee extends Model {}
ShopEmployee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        shopId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Shop,
                key: 'id'
            }
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Employee,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        modelName: 'shop_employee',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['shopId', 'employeeId']
            }
        ],
    }
);

module.exports = ShopEmployee;