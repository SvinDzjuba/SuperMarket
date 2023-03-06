const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: 'user',
        timestamps: true,
    }
)

module.exports = User;