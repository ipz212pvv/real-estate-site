const {models} = require('../models');
const {UserType } = models;

const getAllUserTypes = async () => {
    try {
        return await UserType.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати типи користувачів: ' + error.message);
    }
};

const getUserTypeById = async (id) => {
    try {
        const userType = await UserType.findByPk(id);
        if (!userType) {
            throw new Error('Тип користувача не знайдено');
        }
        return userType;
    } catch (error) {
        throw new Error('Не вдалося отримати тип користувача: ' + error.message);
    }
};

const createUserType = async (userTypeData) => {
    try {
        return await UserType.create(userTypeData);
    } catch (error) {
        throw new Error('Не вдалося створити тип користувача: ' + error.message);
    }
};

const updateUserTypeById = async (id, body) => {
    try {
        const userType = await UserType.findByPk(id);
        if (!userType) {
            throw new Error('Тип користувача не знайдено');
        }

        let { name,description } = body;
        let updateFields = {};

        if (name) updateFields.name = name;
        if (description) updateFields.description = description;

        return await userType.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити тип користувача: ' + error.message);
    }
};

const deleteUserTypeById = async (id) => {
    try {
        const userType = await UserType.findByPk(id);
        if (!userType) {
            throw new Error('Тип користувача не знайдено');
        }
        await userType.destroy();
        return { message: 'Тип користувача успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити тип користувача: ' + error.message);
    }
};

module.exports = {
    getAllUserTypes,
    getUserTypeById,
    createUserType,
    updateUserTypeById,
    deleteUserTypeById,
};
