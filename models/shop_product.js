const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const Shop = require('./shop');
const Product = require('./product');

class ShopProduct extends Model {}
ShopProduct.init(
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
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        modelName: 'shop_product',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['shopId', 'productId']
            }
        ],
    }
);

module.exports = ShopProduct;