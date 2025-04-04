const { models } = require('../models');
const { isExistData } = require("../utils/isExist");
const { AdvertBenefits,Advert,Benefits } = models;

const getAllAdvertBenefits = async () => {
    try {
        return await AdvertBenefits.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати бенефіти для оголошень: ' + error.message);
    }
};

const getAdvertBenefitById = async (id) => {
    try {
        const advertBenefit = await AdvertBenefits.findByPk(id);
        if (!advertBenefit) {
            throw new Error('Бенефіт для оголошення не знайдено');
        }
        return advertBenefit;
    } catch (error) {
        throw new Error('Не вдалося отримати бенефіт для оголошення: ' + error.message);
    }
};

const createAdvertBenefit = async (advertBenefitData) => {
    try {
        const {advertId,benefitId} = advertBenefitData;
        if(!await isExistData(Advert, advertId)){
            throw new Error('Такого оголошення не існує')
        }
        if (!await isExistData(Benefits, benefitId)) {
            throw new Error('Такого бенефіту не існує');
        }

        return await AdvertBenefits.create(advertBenefitData);
    } catch (error) {
        throw new Error('Не вдалося створити бенефіт для оголошення: ' + error.message);
    }
};

const updateAdvertBenefitById = async (id, benefitId) => {
    try {
        const advertBenefit = await AdvertBenefits.findByPk(id);
        if (!advertBenefit) {
            throw new Error('Бенефіт для оголошення не знайдено');
        }
        if (!await isExistData(Benefits, benefitId)) {
            throw new Error('Такого бенефіту не існує');
        }
        return await advertBenefit.update({benefitId:benefitId});
    } catch (error) {
        throw new Error('Не вдалося оновити бенефіт для оголошення: ' + error.message);
    }
};

const deleteAdvertBenefitById = async (id) => {
    try {
        const advertBenefit = await AdvertBenefits.findByPk(id);
        if (!advertBenefit) {
            throw new Error('Бенефіт для оголошення не знайдено');
        }
        await advertBenefit.destroy();
        return { message: 'Бенефіт для оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити бенефіт для оголошення: ' + error.message);
    }
};

module.exports = {
    getAllAdvertBenefits,
    getAdvertBenefitById,
    createAdvertBenefit,
    updateAdvertBenefitById,
    deleteAdvertBenefitById,
};
