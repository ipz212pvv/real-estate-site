const {models} = require('../models');
const {AdvertType } = models;

const getAllAdvertTypes = async () => {
    try {
        return await AdvertType.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати типи оголошень: ' + error.message);
    }
};

const getAdvertTypeById = async (id) => {
    try {
        const advertType = await AdvertType.findByPk(id);
        if (!advertType) {
            throw new Error('Тип оголошення не знайдено');
        }
        return advertType;
    } catch (error) {
        throw new Error('Не вдалося отримати тип оголошення: ' + error.message);
    }
};

const createAdvertType = async (advertTypeData) => {
    try {
        return await AdvertType.create(advertTypeData);
    } catch (error) {
        throw new Error('Не вдалося створити тип оголошення: ' + error.message);
    }
};

const updateAdvertTypeById = async (id, advertTypeData) => {
    try {
        const advertType = await AdvertType.findByPk(id);
        if (!advertType) {
            throw new Error('Тип оголошення не знайдено');
        }
        return await advertType.update(advertTypeData);
    } catch (error) {
        throw new Error('Не вдалося оновити тип оголошення: ' + error.message);
    }
};

const deleteAdvertTypeById = async (id) => {
    try {
        const advertType = await AdvertType.findByPk(id);
        if (!advertType) {
            throw new Error('Тип оголошення не знайдено');
        }
        await advertType.destroy();
        return { message: 'Тип оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити тип оголошення: ' + error.message);
    }
};

module.exports = {
    getAllAdvertTypes,
    getAdvertTypeById,
    createAdvertType,
    updateAdvertTypeById,
    deleteAdvertTypeById,
};
