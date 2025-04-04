const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Широта (lat) не може бути порожньою' },
            notNull: { msg: 'Широта (lat) обовʼязкова' },
        },
    },
    lon: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Довгота (lon) не може бути порожньою' },
            notNull: { msg: 'Довгота (lon) обовʼязкова' },
        },
    },
    addresstype: { type: DataTypes.STRING, allowNull: true },
    class: { type: DataTypes.STRING, allowNull: true },
    building: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    district: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    house_number: { type: DataTypes.STRING, allowNull: true },
    road: { type: DataTypes.STRING, allowNull: true },
    quarter: { type: DataTypes.STRING, allowNull: true },
    suburb: { type: DataTypes.STRING, allowNull: true },
    display_name: { type: DataTypes.STRING, allowNull: true },
    borough: { type: DataTypes.STRING, allowNull: true },
    postcode: { type: DataTypes.STRING, allowNull: true },
    type: { type: DataTypes.STRING, allowNull: true },
    building_levels: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'location',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = Location;
