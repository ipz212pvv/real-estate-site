const { models } = require('../models');
const OSMDataFetcher = require("../services/OSMDataFetcher");
const { AdvertNearbyPlaces,Advert,NearbyPlaces } = models;
const advertRepository = require("./advertRepository");
const nearbyPlacesRepository = require("./nearbyPlacesRepository");
const { createNearbyPlace } = require("./nearbyPlacesRepository");
const { isExistData } = require("../utils/isExist");

const getAllAdvertNearbyPlaces = async () => {
    try {
        return await AdvertNearbyPlaces.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати найближчі місця для оголошень: ' + error.message);
    }
};

const getAdvertNearbyPlaceById = async (id) => {
    try {
        const advertNearbyPlace = await AdvertNearbyPlaces.findByPk(id);
        if (!advertNearbyPlace) {
            throw new Error('Найближче місце для оголошення не знайдено');
        }
        return advertNearbyPlace;
    } catch (error) {
        throw new Error('Не вдалося отримати найближче місце для оголошення: ' + error.message);
    }
};

const getDistanceAndDurationByIds = async (advertId,nearbyPlaceId) => {
    try {
       const advert = await advertRepository.getAdvertById(advertId);
       const nearbyPlace = await nearbyPlacesRepository.getNearbyPlaceById(nearbyPlaceId);

        const fetcher = new OSMDataFetcher();
        return await fetcher.getRoute(
          advert.locationForAdvert.lat, advert.locationForAdvert.lon,
          nearbyPlace.locationForNearbyPlace.lat, nearbyPlace.locationForNearbyPlace.lon
        );
    } catch (error) {
        throw new Error('Не вдалося отримати найближче місце для оголошення: ' + error.message);
    }
};

const createAdvertNearbyPlace = async (advertNearbyPlaceData) => {
    try {
        let {advertId,nearbyPlaceId,lat,lon } = advertNearbyPlaceData;
        if(!nearbyPlaceId) {
            nearbyPlaceId = await createNearbyPlace({lat,lon});
            nearbyPlaceId = nearbyPlaceId.id;
        }
        if (!await isExistData(Advert, advertId)) {
            throw new Error('Такого оголошення не існує');
        }
        const {distance,duration} = await getDistanceAndDurationByIds(advertId, nearbyPlaceId);

        return await AdvertNearbyPlaces.create({advertId:advertId,nearbyPlaceId:nearbyPlaceId, distance: distance, duration: duration});
    } catch (error) {
        throw new Error('Не вдалося створити найближче місце для оголошення: ' + error.message);
    }
};

const updateAdvertNearbyPlaceById = async (id, body) => {
    try {
        const advertNearbyPlace = await AdvertNearbyPlaces.findByPk(id);
        if (!advertNearbyPlace) {
            throw new Error('Найближче місце для оголошення не знайдено');
        }
        let { nearbyPlaceId, distance,duration } = body;
        let updateFields = {};
        if (!await isExistData(NearbyPlaces, nearbyPlaceId)) {
            throw new Error('Такого оголошення не існує');
        }
        if (nearbyPlaceId) updateFields.nearbyPlaceId = nearbyPlaceId;
        if (distance) updateFields.distance = distance;
        if (duration) updateFields.duration = duration;

        return await advertNearbyPlace.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити найближче місце для оголошення: ' + error.message);
    }
};

const deleteAdvertNearbyPlaceById = async (id) => {
    try {
        const advertNearbyPlace = await AdvertNearbyPlaces.findByPk(id);
        if (!advertNearbyPlace) {
            throw new Error('Найближче місце для оголошення не знайдено');
        }
        await advertNearbyPlace.destroy();
        return { message: 'Найближче місце для оголошення успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити найближче місце для оголошення: ' + error.message);
    }
};

module.exports = {
    getAllAdvertNearbyPlaces,
    getAdvertNearbyPlaceById,
    createAdvertNearbyPlace,
    updateAdvertNearbyPlaceById,
    deleteAdvertNearbyPlaceById,
};
