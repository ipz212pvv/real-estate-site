const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdvertImage = sequelize.define('AdvertImage', {
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
    imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'imageUrl не може бути порожнім' },
            notNull: { msg: 'imageUrl обовʼязковий' },
        },
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'advert_image',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = AdvertImage;
