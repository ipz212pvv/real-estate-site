const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdvertBenefits = sequelize.define('AdvertBenefits', {
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
    benefitId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'benefitId не може бути порожнім' },
            notNull: { msg: 'benefitId обовʼязковий' },
        },
    },
}, {
    tableName: 'advert_benefits',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = AdvertBenefits;
