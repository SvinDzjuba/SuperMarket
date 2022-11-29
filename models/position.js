const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class Position extends Model {}
Position.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: 'position',
        timestamps: false
    }
)

module.exports = Position;