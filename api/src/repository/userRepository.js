const {models} = require('../models');
const {User,UserType } = models;
const { getUserTypeInclude } = require('./../utils/include');
const {Sequelize} = require("sequelize");
const argon2 = require('argon2');
const { getDecodedTokenFromHeader, generateToken } = require("../utils/token");
const FileService = require('../services/FileService');
const { isExistData } = require("../utils/isExist");

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['password'],
            },
            include: getUserTypeInclude(),
        });

        return await Promise.all(users.map(async (user) => {
            user.image = await FileService.getUserImage(user.id);
            return user;
        }));
    } catch (error) {
        throw new Error('Не вдалося отримати користувачів: ' + error.message);
    }
};

const getUser = async (where) => {
    try {
        const user = await User.findOne({
            where: {
                ...where,
                /*role: { [Sequelize.Op.ne]: 'admin' },*/
            },
            attributes: {
                exclude: ['password'],
            },
            include: getUserTypeInclude(),
        });

        if (!user) {
            throw new Error('Користувача не знайдено');
        }

        user.image = await FileService.getUserImage(user.id);
        return user;
    } catch (error) {
        throw new Error('Не вдалося отримати користувача: ' + error.message);
    }
};

const getUserLogin = async (email) => {
    try {
        const user = await User.findOne({where:email});
        if (!user) {
            throw new Error('Користувача не знайдено');
        }
        return user;
    } catch (error) {
        throw new Error('Не вдалося отримати користувача: ' + error.message);
    }
};

const getCurrentUser = async (req) => {
    try {
        const  decoded = getDecodedTokenFromHeader(req);
        const user = await models.User.findOne({ where: { email: decoded.email } });
        if (!user) {
            throw new Error('Такого юзера не знайдено');
        }
        return user;
    } catch (error) {
        throw new Error('Не вдалося отримати користувача: ' + error.message);
    }
};

const createUser = async (userData) => {
    try {
        if (!await isExistData(UserType, userData.userTypeId)) {
            throw new Error('Такого типу юзера не існує');
        }
        userData.role =  "user";
        return await User.create(userData);
    } catch (error) {
        throw new Error('Не вдалося створити користувача: ' + error.message);
    }
};

const updateUserById = async (id, userData) => {
    try {
        const user = await User.findByPk(id);
        if (!user) {
            throw new Error('Користувача не знайдено');
        }

        let updateFields = {};

        if (userData.name) updateFields.name = userData.name;
        if (userData.surname) updateFields.surname = userData.surname;
        if (userData.email) updateFields.email = userData.email;
        if (userData.phone) updateFields.phone = userData.phone;

        return await user.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити користувача: ' + error.message);
    }
};


const deleteUserById = async (id) => {
    try {
        const user = await User.findByPk(id);

        if (!user) {
            throw new Error('Користувача не знайдено');
        }
        await FileService.deleteUserImage(user.id);
        await user.destroy();
        return { message: 'Користувача успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити користувача: ' + error.message);
    }
};

const updateUserBlockStatus = async (id, isBlocked) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Користувача не знайдено');
        await user.update({ isBlocked });
        return { success: true };
    } catch (error) {
        throw new Error('Не вдалося змінити статус блокування користувача: ' + error.message);
    }
};

const changeUserPassword = async ( req,currentPassword, newPassword, confirmPassword) => {
    try {
        const  decoded = getDecodedTokenFromHeader(req);

        if (newPassword !== confirmPassword) {
            throw new Error('Новий пароль та підтвердження не співпадають');
        }
        const user = await models.User.findOne({ where: { email: decoded.email } });
        if (!user) {
            throw new Error('Такого юзера не знайдено');
        }
        const isValidPassword = await argon2.verify(user.password, currentPassword);
        if (!isValidPassword) {
            throw new Error('Поточний пароль невірний');
        }

        if (!newPassword || newPassword.length < 4) {
            throw new Error('Новий пароль має містити щонайменше 4 символи');
        }

        await user.update({ password: await argon2.hash(newPassword) });
        const newToken = generateToken(user);
        return { success: true, message: 'Пароль успішно змінено', token: newToken };
    } catch (error) {
        throw new Error('Не вдалося змінити пароль: ' + error.message);
    }
};

const uploadUserImage = async (id, file) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Користувача не знайдено');

        await FileService.uploadUserImage(id, file);
        return { success: true, message: 'Зображення успішно завантажено' };
    } catch (error) {
        throw new Error('Не вдалося завантажити зображення: ' + error.message);
    }
};

const deleteUserImage = async (id) => {
    try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Користувача не знайдено');

        await FileService.deleteUserImage(id);
        return { success: true, message: 'Зображення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити зображення: ' + error.message);
    }
};

const updateUserRating = async (id, newRating) => {
    const user = await User.findByPk(id);

    const rating = Number(newRating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
        throw new Error('Рейтинг має бути числом між 0 та 5');
    }

    const averageRating = await calculateAverageRating(rating, user.rating);
    const roundedAverageRating = Math.round(averageRating);

    await user.update({ rating: roundedAverageRating });

    return { success: true, rating: roundedAverageRating };
};

const calculateAverageRating = (newRating, currentRating) => {
    if (typeof newRating !== 'number' || typeof currentRating !== 'number') {
        throw new Error('Both newRating and oldRating should be numbers');
    }

    return currentRating===0? newRating: (newRating + currentRating) / 2;
};

module.exports = {
    getAllUsers,
    getUser,
    getUserLogin,
    createUser,
    updateUserById,
    deleteUserById,
    updateUserBlockStatus,
    changeUserPassword,
    uploadUserImage,
    deleteUserImage,
    updateUserRating,
    getCurrentUser
};