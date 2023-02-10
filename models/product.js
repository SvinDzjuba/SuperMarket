const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const ClassificationType = require('./classification_type');

class Product extends Model {}
Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ClassificationType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ClassificationType,
                key: 'id'
            }
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255)
        }
    },
    {
        sequelize: db,
        modelName: 'product',
        timestamps: true,
        paranoid: true
    }
)

module.exports = Product;