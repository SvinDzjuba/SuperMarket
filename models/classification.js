const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class Classification extends Model {}
Classification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: 'classification',
        timestamps: false
    }
)

module.exports = Classification;