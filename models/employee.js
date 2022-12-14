const { DataTypes, Model } = require('sequelize');
const { db } = require('../config/database');
const Position = require('./position');

class Employee extends Model {}
Employee.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Position,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        modelName: 'employee',
        timestamps: true,
    }
)

module.exports = Employee;