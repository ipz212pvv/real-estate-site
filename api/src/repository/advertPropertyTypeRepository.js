const {models} = require('../models');
const {AdvertPropertyType } = models;

const getAllAdvertPropertyTypes = async () => {
    try {
        return await AdvertPropertyType.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати типи оголошень: ' + error.message);
    }
};

const getAdvertPropertyTypeById = async (id) => {
    try {
        const advertPropertyType = await AdvertPropertyType.findByPk(id);
        if (!advertPropertyType) {
            throw new Error('Тип оголошення не знайдено');
        }
        return advertPropertyType;
    } catch (error) {
        throw new Error('Не вдалося отримати тип оголошення: ' + error.message);
    }
};

const createAdvertPropertyType = async (advertPropertyTypeData) => {
    try {
        return await AdvertPropertyType.create(advertPropertyTypeData);
    } catch (error) {
        throw new Error('Не вдалося створити тип оголошення: ' + error.message);
    }
};

const updateAdvertPropertyTypeById = async (id, advertPropertyTypeData) => {
    try {
        const advertPropertyType = await AdvertPropertyType.findByPk(id);
        if (!advertPropertyType) {
            throw new Error('Тип оголошення не знайдено');
        }
        return await advertPropertyType.update(advertPropertyTypeData);
    } catch (error) {
        throw new Error('Не вдалося оновити тип оголошення: ' + error.message);
    }
};

const deleteAdvertPropertyTypeById = async (id) => {
    try {
        const advertPropertyType = await AdvertPropertyType.findByPk(id);
        if (!advertPropertyType) {
            throw new Error('Тип оголошення не знайдено');
        }
        await advertPropertyType.destroy();
        return { message: 'Тип оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити тип оголошення: ' + error.message);
    }
};

module.exports = {
    getAllAdvertPropertyTypes,
    getAdvertPropertyTypeById,
    createAdvertPropertyType,
    updateAdvertPropertyTypeById,
    deleteAdvertPropertyTypeById,
};
