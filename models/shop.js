const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class Shop extends Model {}
Shop.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: 'shop',
        timestamps: false,
    }
);

module.exports = Shop;