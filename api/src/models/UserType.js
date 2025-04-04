const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const UserType = sequelize.define('UserType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Такий тип користувача вже існує',
        },
        validate: {
            notEmpty: {
                msg: 'Назва типу користувача не може бути порожньою',
            },
            notNull: {
                msg: 'Назва типу користувача обовʼязкова',
            },
        },
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'user_type',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = UserType;
