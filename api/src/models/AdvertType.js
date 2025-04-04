const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdvertType = sequelize.define('AdvertType', {
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
            msg: 'Такий тип оголошення вже існує',
        },
        validate: {
            notEmpty: {
                msg: 'Назва типу оголошення не може бути порожньою',
            },
            notNull: {
                msg: 'Назва типу оголошення обовʼязкова',
            },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'advert_type',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = AdvertType;
