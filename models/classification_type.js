const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const Classification = require('./classification');
const Type = require('./type');

class ClassificationType extends Model {}
ClassificationType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        classificationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Classification,
                key: 'id'
            },
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Type,
                key: 'id'
            },
        }
    },
    {
        sequelize: db,
        modelName: 'classification_type',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['classificationId', 'typeId']
            }
        ],
    }
)

module.exports = ClassificationType;