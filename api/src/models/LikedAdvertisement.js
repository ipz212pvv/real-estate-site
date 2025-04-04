const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LikedAdvertisement = sequelize.define('LikedAdvertisement', {
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
    advertId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'advertId не може бути порожнім' },
            notNull: { msg: 'advertId обовʼязковий' },
        },
    },
}, {
    tableName: 'liked_advertisement',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = LikedAdvertisement;
