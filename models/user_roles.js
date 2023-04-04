const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const User = require('./user');
const Role = require('./role');

class UserRole extends Model {}
UserRole.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        modelName: 'user_role',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'roleId']
            }
        ],
    }
);

module.exports = UserRole;