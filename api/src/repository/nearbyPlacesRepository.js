const {models} = require('../models');
const {NearbyPlaces } = models;
const { getLocationInclude } = require('./../utils/include');
const locationRepository = require("./locationRepository");
const OSMDataFetcher = require("../services/OSMDataFetcher");

const getAllNearbyPlaces = async () => {
    try {
        return await NearbyPlaces.findAll(
          {
              include: [getLocationInclude("locationForNearbyPlace")]
          }
        );
    } catch (error) {
        throw new Error('Не вдалося отримати місця поблизу: ' + error.message);
    }
};

const getNearbyPlaceById = async (id) => {
    try {
        const nearbyPlace = await NearbyPlaces.findByPk(id,{
            include: [getLocationInclude("locationForNearbyPlace")]
        });
        if (!nearbyPlace) {
            throw new Error('Місце поблизу не знайдено');
        }
        return nearbyPlace;
    } catch (error) {
        throw new Error('Не вдалося отримати місце поблизу: ' + error.message);
    }
};

const createNearbyPlace = async (body) => {
    try {
        const { lat, lon} = body;
        const location = await locationRepository.createLocation(lat, lon);
        const data = await OSMDataFetcher.getJsonData(lat, lon);

        const nearbyPlaceData = {
            locationId: location.id,
            opening_hours: data.buildingDetails?.opening_hours || null,
            website: data.buildingDetails?.website || null,
            phone: data.buildingDetails?.phone || null,
            brand: data.buildingDetails?.brand || data.address?.amenity || null,
            email: data.buildingDetails?.email || null,
            name: data.name || data.address?.amenity || null,
        };

        return await NearbyPlaces.create(nearbyPlaceData);
    } catch (error) {
        throw new Error('Не вдалося створити місце поблизу: ' + error.message);
    }
};

const updateNearbyPlaceById = async (id, nearbyPlaceData) => {
    try {
        const nearbyPlace = await NearbyPlaces.findByPk(id);
        if (!nearbyPlace) {
            throw new Error('Місце поблизу не знайдено');
        }
        let updateFields = {};

        const { opening_hours, website, phone, brand, email, name } = nearbyPlaceData;

        if (opening_hours) updateFields.opening_hours = opening_hours;
        if (website) updateFields.website = website;
        if (phone) updateFields.phone = phone;
        if (brand) updateFields.brand = brand;
        if (email) updateFields.email = email;
        if (name) updateFields.name = name;

        return await nearbyPlace.update(updateFields);
    } catch (error) {
        throw new Error('Не вдалося оновити місце поблизу: ' + error.message);
    }
};

const deleteNearbyPlaceById = async (id) => {
    try {
        const nearbyPlace = await NearbyPlaces.findByPk(id);
        if (!nearbyPlace) {
            throw new Error('Місце поблизу не знайдено');
        }
        await nearbyPlace.destroy();
        return { message: 'Місце поблизу успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити місце поблизу: ' + error.message);
    }
};

module.exports = {
    getAllNearbyPlaces,
    getNearbyPlaceById,
    createNearbyPlace,
    updateNearbyPlaceById,
    deleteNearbyPlaceById,
};
