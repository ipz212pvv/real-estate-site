const { models } = require('../models');
const userRepository = require("./userRepository");
const locationRepository = require("./locationRepository");
const { Advert ,AdvertType,AdvertPropertyType} = models;
const { getAdvertCommentInclude,getAdvertPropertyTypeInclude,getUserInclude,getLocationInclude,getAdvertTypeInclude ,getAdvertImageInclude,getAdvertBenefitsInclude, getAdvertNearbyPlacesInclude} = require('./../utils/include');
const FileService = require('../services/FileService');
const {getUsdToUahRate,calculatePrice} = require("../services/RateFetcherService");
const { Op } = require("sequelize");
const { isExistData } = require("../utils/isExist");
const { getDecodedTokenFromHeader } = require("../utils/token");
const getPaginationParams = require("../utils/pagination");

const include =  [
    getUserInclude("userOfAdvert"),
    getLocationInclude("locationForAdvert"),
    getAdvertTypeInclude(),
    getAdvertImageInclude(),
    getAdvertBenefitsInclude(),
    getAdvertNearbyPlacesInclude(),
    getAdvertPropertyTypeInclude()
];

const updateAdvertImages = async (adverts) => {
    for (const advert of adverts) {
        for (const advertImage of advert.advertImages) {
            advertImage.imageUrl = await FileService.getAdvertImage(advertImage.imageUrl);
        }
        if (advert.userOfAdvert && advert.userOfAdvert.image) {
            advert.userOfAdvert.image = await FileService.getUserImage(advert.userOfAdvert.id);
        }
        if (advert.advertComments){
            for (const comment of advert.advertComments) {
                if (comment.userForComment && comment.userForComment.image) {
                    comment.userForComment.image = await FileService.getUserImage(comment.userForComment.id);
                }
            }
        }
    }
};

const getSearchedAdverts = async (query, where = {}) => {
    try {
        const { limit,page,propertyTypeId,floor,title,room,typeId, minPriceUah, maxPriceUah, minPriceUsd, maxPriceUsd, city, country,  minArea, maxArea, benefits } = query;
        where.isHidden = false;
        if (typeId) where.typeId = typeId;
        if (propertyTypeId) where.propertyTypeId = propertyTypeId;
        if (floor) where.floor = floor;
        if (room) where.room = room;
        if (title) where.title = { [Op.like]: `${title}%` };

        if (minPriceUah || maxPriceUah) {
            where.price_uah = { ...(where.price_uah || {}) };
            if (minPriceUah) where.price_uah[Op.gte] = parseFloat(minPriceUah);
            if (maxPriceUah) where.price_uah[Op.lte] = parseFloat(maxPriceUah);
        }

        if (minPriceUsd || maxPriceUsd) {
            where.price_usd = { ...(where.price_usd || {}) };
            if (minPriceUsd) where.price_usd[Op.gte] = parseFloat(minPriceUsd);
            if (maxPriceUsd) where.price_usd[Op.lte] = parseFloat(maxPriceUsd);
        }

        if (city) where["$locationForAdvert.city$"] = { [Op.like]: `${city}%` };
        if (country) where["$locationForAdvert.country$"] = { [Op.like]: `${country}%` };

        if (minArea || maxArea) {
            where.area = { ...(where.area || {}) };
            if (minArea) where.area[Op.gte] = parseFloat(minArea);
            if (maxArea) where.area[Op.lte] = parseFloat(maxArea);
        }

        if (benefits) {
            const benefitsArray = Array.isArray(benefits) ? benefits : benefits.split(',');
            where["$advertBenefitsForAdvert.benefitId$"] = { [Op.in]: benefitsArray.map(id => parseInt(id)) };
        }

        return  await getAllAdverts(where,{limit,page});

    } catch (error) {
        throw new Error('Не вдалося отримати оголошення: ' + error.message);
    }
};

const getAllAdverts = async (where = {}, query = {}) => {
    try {
        const { page, limit, offset } = getPaginationParams(query);
        const usePagination = query.page || query.limit;

        const options = {
            where,
            include: include,
            order: [['createdAt', 'DESC']],
            subQuery: false,
        };

        if (usePagination) {
            options.limit = limit;
            options.offset = offset;
        }

        const { count, rows } = await Advert.findAndCountAll(options);
        await updateAdvertImages(rows);

        return {
            total: count,
            page: usePagination ? page : 1,
            pageSize: usePagination ? limit : count,
            adverts: rows,
        };
    } catch (error) {
        throw new Error('Не вдалося отримати оголошення: ' + error.message);
    }
};

const getUserAdverts = async (req) => {
    try {
        const  decoded = getDecodedTokenFromHeader(req);
        const user = await models.User.findOne({ where: { email: decoded.email } });

        return await getAllAdverts({
            'userId': user.id,
        });
    } catch (error) {
        throw new Error('Не вдалося отримати оголошення: ' + error.message);
    }
};

const getAdvertById = async (id, where = {}) => {
    try {
        const advert = await Advert.findOne({
            where: {
                id,
                ...where
            },
            include: [...include, getAdvertCommentInclude()],
        });

        if (!advert) {
            throw new Error('Оголошення не знайдено');
        }

        await updateAdvertImages([advert]);
        return advert;
    } catch (error) {
        throw new Error('Не вдалося отримати оголошення: ' + error.message);
    }
};

const getCalculatedPrices = async (usdData, price_usd, price_uah) => {
    if (price_usd && price_uah) {
        price_uah = calculatePrice(price_usd, usdData.rate);
    }

    if (!price_usd && price_uah) {
        price_usd = price_uah / usdData.rate;
    }

    if (!price_uah && price_usd) {
        price_uah = calculatePrice(price_usd, usdData.rate);
    }

    return { price_usd, price_uah };
}

const createAdvert = async (req) => {
    try {
        const user = await userRepository.getCurrentUser(req);
        req.body.userId = user.id;
        let { lat, lon,price_usd,price_uah,typeId,propertyTypeId,  ...advertData } = req.body;
        if (!await isExistData(AdvertType, typeId)) {
            throw new Error('Такого типу оголошення не існує');
        }
        if (!await isExistData(AdvertPropertyType, propertyTypeId)) {
            throw new Error('Такого типу оголошення не існує');
        }
        const location = await locationRepository.createLocation(lat, lon);
        let data= await getUsdToUahRate();

        ({ price_usd, price_uah } = await getCalculatedPrices(data, price_usd, price_uah));

        return await Advert.create({ ...advertData,typeId:typeId, propertyTypeId:propertyTypeId,price_usd:price_usd,price_uah:price_uah,locationId: location.id });
    } catch (error) {
        throw new Error('Не вдалося створити оголошення: ' + error.message);
    }
};

const updateAdvertById = async (id, body) => {
    try {
        const advert = await Advert.findByPk(id);
        if (!advert) {
            throw new Error('Оголошення не знайдено');
        }

        let {propertyTypeId,typeId,isHidden, price_uah, price_usd,area,title,description,floor,room } = body;
        let updateFields = {};

        if (price_uah || price_usd) {
            let data= await getUsdToUahRate();
            ({ price_usd, price_uah } = await getCalculatedPrices(data, price_usd, price_uah));
            updateFields.price_uah = price_uah;
            updateFields.price_usd = price_usd;
        }
        if (area) updateFields.area = area;
        if (propertyTypeId) updateFields.propertyTypeId = propertyTypeId;
        if (typeId) updateFields.typeId = typeId;
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (floor) updateFields.floor = floor;
        if (room) updateFields.room = room;
        if (typeof isHidden !== 'undefined') updateFields.isHidden = isHidden;

        return await advert.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити оголошення: ' + error.message);
    }
};

const deleteAdvertById = async (id) => {
    try {
        const advert = await Advert.findByPk(id);
        if (!advert) {
            throw new Error('Оголошення не знайдено');
        }
        await advert.destroy();
        return { message: 'Оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити оголошення: ' + error.message);
    }
};

module.exports = {
    getAllAdverts,
    getAdvertById,
    createAdvert,
    updateAdvertById,
    deleteAdvertById,
    getSearchedAdverts,
    getUserAdverts
};
