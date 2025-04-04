const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Benefits = sequelize.define('Benefits', {
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
            msg: 'Такий бенефіт вже існує',
        },
        validate: {
            notEmpty: {
                msg: 'Назва бенефіту не може бути порожньою',
            },
            notNull: {
                msg: 'Назва бенефіту обовʼязкова',
            },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'benefits',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
});

module.exports = Benefits;
