const {models } = require('../models');
const {AdvertImage,Advert } = models;
const FileService = require('../services/FileService');
const { isExistData } = require("../utils/isExist");

const getAllAdvertImages = async () => {
    try {
        const advertImages = await AdvertImage.findAll();

        for (let advertImage of advertImages) {
            advertImage.imageUrl = await FileService.getAdvertImage(advertImage.imageUrl);
        }

        return advertImages;
    } catch (error) {
        throw new Error('Не вдалося отримати зображення реклам: ' + error.message);
    }
};

const getAdvertImageById = async (id) => {
    try {
        const advertImage = await AdvertImage.findByPk(id);
        if (!advertImage) {
            throw new Error('Зображення реклами не знайдено');
        }

       advertImage.imageUrl= await FileService.getAdvertImage(advertImage.imageUrl);
        return advertImage;
    } catch (error) {
        throw new Error('Не вдалося отримати зображення реклами: ' + error.message);
    }
};

const getNextAdvertImagePosition = async (advertId) => {
    const maxPosition = await AdvertImage.max('position', {
        where: { advertId }
    });
    return maxPosition ? maxPosition + 1 : 1;
};

const createAdvertImage = async (req) => {
    try {
       let [advertId,imageUrl] =[req.body.advertId, req.file];
       if (!await isExistData(Advert, advertId)) {
            throw new Error('Такого оголошення не існує');
       }
       if(!imageUrl){
           throw new Error('Фото не може бути пустим');
       }

       const imageName =  imageUrl.originalname;
       const position = await getNextAdvertImagePosition(advertId);

       const advertImage = await AdvertImage.create({
            advertId,
            position,
            imageUrl: imageName
       });

       return  await FileService.uploadAdvertImage(advertImage.id,imageUrl);
    } catch (error) {
        throw new Error('Не вдалося створити зображення реклами: ' + error.message);
    }
};

const updateAdvertImageById = async (id, req) => {
    try {
        const advertImage = await AdvertImage.findByPk(id);
        if (!advertImage) {
            throw new Error('Зображення реклами не знайдено');
        }
        const imageUrl = req.file;
        let updateFields = {};

        if (imageUrl) {
            updateFields.imageUrl = await FileService.uploadAdvertImage(advertImage.id,imageUrl);
        }

        return await advertImage.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити зображення реклами: ' + error.message);
    }
};

const deleteAdvertImageById = async (id) => {
    try {
        const advertImage = await AdvertImage.findByPk(id);
        if (!advertImage) {
            throw new Error('Зображення реклами не знайдено');
        }
        await FileService.deleteAdvertImage(advertImage.id);
        return { message: 'Зображення реклами успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити зображення реклами: ' + error.message);
    }
};

const moveAdvertImage = async (id, newPosition) => {
    try {
        const advertImage = await AdvertImage.findByPk(id);
        if (!advertImage) {
            throw new Error('Зображення реклами не знайдено');
        }

        const advertId = advertImage.advertId;

        const images = await AdvertImage.findAll({
            where: { advertId },
            order: [['position', 'ASC']]
        });

        if (newPosition < 1 || newPosition > images.length) {
            throw new Error('Неприпустима позиція');
        }

        images.splice(images.findIndex(img => img.id === id), 1);
        images.splice(newPosition - 1, 0, advertImage);

        await Promise.all(
          images.map((img, index) => img.update({ position: index + 1 }))
        );

        return { message: 'Позиція зображення успішно оновлена' };
    } catch (error) {
        throw new Error('Не вдалося змінити позицію зображення реклами: ' + error.message);
    }
};


module.exports = {
    getAllAdvertImages,
    getAdvertImageById,
    createAdvertImage,
    updateAdvertImageById,
    deleteAdvertImageById,
    moveAdvertImage
};
