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
            unique: true,
        },
    },
    {
        sequelize: db,
        modelName: 'role',
        timestamps: true,
    }
)

module.exports = Role;