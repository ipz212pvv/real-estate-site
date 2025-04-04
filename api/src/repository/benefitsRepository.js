const {models} = require('../models');
const {Benefits } = models;

const getAllBenefits = async () => {
    try {
        return await Benefits.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати бенефіти: ' + error.message);
    }
};

const getBenefitById = async (id) => {
    try {
        const benefit = await Benefits.findByPk(id);
        if (!benefit) {
            throw new Error('Бенефіт не знайдений');
        }
        return benefit;
    } catch (error) {
        throw new Error('Не вдалося отримати бенефіт: ' + error.message);
    }
};

const createBenefit = async (benefitData) => {
    try {
        return await Benefits.create(benefitData);
    } catch (error) {
        throw new Error('Не вдалося створити бенефіт: ' + error.message);
    }
};

const updateBenefitById = async (id, body) => {
    try {
        const benefit = await Benefits.findByPk(id);
        if (!benefit) {
            throw new Error('Бенефіт не знайдений');
        }

        let { name,description } = body;
        let updateFields = {};

        if (name) updateFields.name = name;
        if (description) updateFields.description = description;

        return await benefit.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити бенефіт: ' + error.message);
    }
};

const deleteBenefitById = async (id) => {
    try {
        const benefit = await Benefits.findByPk(id);
        if (!benefit) {
            throw new Error('Бенефіт не знайдений');
        }
        await benefit.destroy();
        return { message: 'Бенефіт успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити бенефіт: ' + error.message);
    }
};

module.exports = {
    getAllBenefits,
    getBenefitById,
    createBenefit,
    updateBenefitById,
    deleteBenefitById,
};
