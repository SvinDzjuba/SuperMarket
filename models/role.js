const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class Role extends Model {}
Role.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize: db,
        modelName: 'Role',
        timestamps: true,
    }
)

module.exports = Role;