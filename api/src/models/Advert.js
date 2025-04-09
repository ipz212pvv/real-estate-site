const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Advert = sequelize.define('Advert', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'userId не може бути порожнім' },
            notNull: { msg: 'userId обовʼязковий' },
        },
    },
    typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'typeId не може бути порожнім' },
            notNull: { msg: 'typeId обовʼязковий' },
        },
    },
    price_uah: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: { msg: 'Ціна (UAH) повинна бути числом' },
        },
    },
    price_usd: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: { msg: 'Ціна (USD) повинна бути числом' },
        },
    },
    area: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: { msg: 'Площа повинна бути числом' },
        },
    },
    room: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: 'Кімнати повинні бути числом' },
            min: {
                args: [1],
                msg: 'Має бути принаймні одна кімната',
            },
        },
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: 'Поверх повинен бути числом' },
            min: {
                args: [1],
                msg: 'Має бути принаймні один поверх',
            },
        },
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'locationId не може бути порожнім' },
            notNull: { msg: 'locationId обовʼязковий' },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'advert',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = Advert;
