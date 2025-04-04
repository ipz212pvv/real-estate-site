const { models } = require('../models');
const { getDecodedTokenFromHeader } = require("../utils/token");
const { isExistData } = require("../utils/isExist");
const { LikedAdvertisement, Advert } = models;

const getAllLikedAdvertisements = async () => {
    try {
        return await LikedAdvertisement.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати сподобані оголошення: ' + error.message);
    }
};

const getLikedAdvertisementById = async (id) => {
    try {
        const likedAdvertisement = await LikedAdvertisement.findByPk(id);
        if (!likedAdvertisement) {
            throw new Error('Сподобане оголошення не знайдено');
        }
        return likedAdvertisement;
    } catch (error) {
        throw new Error('Не вдалося отримати сподобане оголошення: ' + error.message);
    }
};

const createLikedAdvertisement = async (req) => {
    try {
        const advertId =req.body.advertId;
        if (!await isExistData(Advert, advertId)) {
            throw new Error('Такого оголошення не існує');
        }
        const userId = getDecodedTokenFromHeader(req).id;
        return await LikedAdvertisement.create({ advertId:advertId,userId:userId });
    } catch (error) {
        throw new Error('Не вдалося створити сподобане оголошення: ' + error.message);
    }
};

const updateLikedAdvertisementById = async (id, advertId) => {
    try {
        const likedAdvertisement = await LikedAdvertisement.findByPk(id);
        if (!likedAdvertisement) {
            throw new Error('Сподобане оголошення не знайдено');
        }
        return await likedAdvertisement.update({ advertId:advertId });
    } catch (error) {
        throw new Error('Не вдалося оновити сподобане оголошення: ' + error.message);
    }
};

const deleteLikedAdvertisementById = async (id) => {
    try {
        const likedAdvertisement = await LikedAdvertisement.findByPk(id);
        if (!likedAdvertisement) {
            throw new Error('Сподобане оголошення не знайдено');
        }
        await likedAdvertisement.destroy();
        return { message: 'Сподобане оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити сподобане оголошення: ' + error.message);
    }
};

module.exports = {
    getAllLikedAdvertisements,
    getLikedAdvertisementById,
    createLikedAdvertisement,
    updateLikedAdvertisementById,
    deleteLikedAdvertisementById,
};
