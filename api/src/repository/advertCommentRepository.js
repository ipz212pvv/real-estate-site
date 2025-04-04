const { models } = require('../models');
const { getDecodedTokenFromHeader } = require("../utils/token");
const { isExistData } = require("../utils/isExist");
const { AdvertComment,Advert } = models;

const getAllAdvertComments = async () => {
  try {
    return await AdvertComment.findAll();
  } catch (error) {
    throw new Error('Не вдалося отримати коментарі до оголошень: ' + error.message);
  }
};

const getAdvertCommentById = async (id) => {
  try {
    const advertComment = await AdvertComment.findByPk(id);
    if (!advertComment) {
      throw new Error('Коментар до оголошення не знайдено');
    }
    return advertComment;
  } catch (error) {
    throw new Error('Не вдалося отримати коментар до оголошення: ' + error.message);
  }
};

const createAdvertComment = async (req) => {
  try {
    const  decoded = getDecodedTokenFromHeader(req);
    const  {advertId,parentId,comment} = req.body;
    if (parentId != null && !await isExistData(AdvertComment, parentId)) {
      throw new Error('Такого коментаря не існує');
    }
    if (!await isExistData(Advert, advertId)) {
      throw new Error('Такого оголошення не існує');
    }
    return await AdvertComment.create({ userId: decoded.id, advertId:advertId, parentId:parentId, comment:comment });
  } catch (error) {
    throw new Error('Не вдалося створити коментар до оголошення: ' + error.message);
  }
};

const updateAdvertCommentById = async (id, comment) => {
  try {
    const advertComment = await AdvertComment.findByPk(id);
    if (!advertComment) {
      throw new Error('Коментар до оголошення не знайдено');
    }
    return await advertComment.update({ comment:comment });
  } catch (error) {
    throw new Error('Не вдалося оновити коментар до оголошення: ' + error.message);
  }
};

const deleteAdvertCommentById = async (id) => {
  try {
    const advertComment = await AdvertComment.findByPk(id);
    if (!advertComment) {
      throw new Error('Коментар до оголошення не знайдено');
    }
    await advertComment.destroy();
    return { message: 'Коментар до оголошення успішно видалено' };
  } catch (error) {
    throw new Error('Не вдалося видалити коментар до оголошення: ' + error.message);
  }
};

module.exports = {
  getAllAdvertComments,
  getAdvertCommentById,
  createAdvertComment,
  updateAdvertCommentById,
  deleteAdvertCommentById,
};
