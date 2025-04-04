const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdvertNearbyPlaces = sequelize.define('AdvertNearbyPlaces', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    advertId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'advertId не може бути порожнім' },
            notNull: { msg: 'advertId обовʼязковий' },
        },
    },
    nearbyPlaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'nearbyPlaceId не може бути порожнім' },
            notNull: { msg: 'nearbyPlaceId обовʼязковий' },
        },
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'advert_nearby_places',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = AdvertNearbyPlaces;
