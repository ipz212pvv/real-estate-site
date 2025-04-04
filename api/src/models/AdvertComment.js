const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AdvertComment = sequelize.define('AdvertComment', {
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'userId не може бути порожнім' },
            notNull: { msg: 'userId обовʼязковий' },
        },
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { msg: 'parentId повинна бути цілим числом' },
        },
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Коментар не може бути порожнім' },
            notNull: { msg: 'Коментар обовʼязковий' },
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'advert_comments',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = AdvertComment;
