const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class Type extends Model {}
Type.init(
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
        modelName: 'type',
        timestamps: false
    }
)

module.exports = Type;