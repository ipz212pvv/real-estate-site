const {models} = require('../models');
const { getDecodedTokenFromHeader } = require("../utils/token");
const { isExistData } = require("../utils/isExist");
const { getComplaintUserInclude, getComplaintAdvertInclude } = require("../utils/include");
const {Complaint,Advert } = models;

const include = [
    getComplaintUserInclude(),
    getComplaintAdvertInclude()
];

const getAllComplaints = async () => {
    try {
        return await Complaint.findAll({ include });
    } catch (error) {
        throw new Error('Не вдалося отримати скарги: ' + error.message);
    }
};

const getComplaintById = async (id) => {
    try {
        const complaint = await Complaint.findByPk(id, { include });
        if (!complaint) {
            throw new Error('Скаргу не знайдено');
        }
        return complaint;
    } catch (error) {
        throw new Error('Не вдалося отримати скаргу: ' + error.message);
    }
};

const createComplaint = async (req) => {
    try {
        const  decoded = getDecodedTokenFromHeader(req);
        req.body.userId = decoded.id;
        if (!await isExistData(Advert, req.body.advertId)) {
            throw new Error('Такого оголошення не існує');
        }
        return await Complaint.create({  userId:req.body.userId, advertId: req.body.advertId,message:req.body.message});
    } catch (error) {
        throw new Error('Не вдалося створити скаргу: ' + error.message);
    }
};

const updateComplaintById = async (id, message) => {
    try {
        const complaint = await Complaint.findByPk(id);
        if (!complaint) {
            throw new Error('Скаргу не знайдено');
        }
        return await complaint.update({message: message});
    } catch (error) {
        throw new Error('Не вдалося оновити скаргу: ' + error.message);
    }
};

const deleteComplaintById = async (id) => {
    try {
        const complaint = await Complaint.findByPk(id);
        if (!complaint) {
            throw new Error('Скаргу не знайдено');
        }
        await complaint.destroy();
        return { message: 'Скаргу успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити скаргу: ' + error.message);
    }
};

module.exports = {
    getAllComplaints,
    getComplaintById,
    createComplaint,
    updateComplaintById,
    deleteComplaintById,
};
