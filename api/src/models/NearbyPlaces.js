const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NearbyPlaces = sequelize.define('NearbyPlaces', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'locationId не може бути порожнім' },
            notNull: { msg: 'locationId обовʼязковий' },
        },
    },
    opening_hours: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: { msg: 'Некоректний URL' },
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: { msg: 'Некоректний email' },
        },
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'nearby_places',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = NearbyPlaces;
