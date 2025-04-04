const {models} = require('../models');
const {Location } = models;
const OSMDataFetcher = require('./../services/OSMDataFetcher');
const { Sequelize } = require("sequelize");


const getAllLocations = async () => {
    try {
        return await Location.findAll();
    } catch (error) {
        throw new Error('Не вдалося отримати локації: ' + error.message);
    }
};

const getLocationById = async (id) => {
    try {
        const location = await Location.findByPk(id);
        if (!location) {
            throw new Error('Локацію не знайдено');
        }
        return location;
    } catch (error) {
        throw new Error('Не вдалося отримати локацію: ' + error.message);
    }
};

const getInformationByData = async (lat, lon) => {
    try {
        const data = await OSMDataFetcher.getJsonData(lat, lon);
        const { address, buildingDetails, display_name,type, class: osmClass, type: osmType } = data;

        return  {
            lat,
            lon,
            addresstype: data.addresstype || null,
            class: osmClass || null,
            type: type || null,
            building: buildingDetails?.building || null,
            city: address?.city || null,
            district: address?.district || null,
            state: address?.state || null,
            country: address?.country || null,
            house_number: address?.house_number || null,
            road: address?.road || null,
            quarter: address?.quarter || null,
            suburb: address?.suburb || null,
            display_name: display_name || null,
            borough: address?.borough || null,
            postcode: address?.postcode || null,
            building_levels: buildingDetails?.['building:levels'] || null
        };
    } catch (error) {
        throw new Error('Не вдалося отримати локацію: ' + error.message);
    }
};

const createLocation = async (lat, lon) => {
    try {
        let location = await Location.findOne({ where: { lat, lon } });

        if (location) {
            return location;
        }

        const locationData = await getInformationByData(lat, lon);

        location = await Location.create(locationData);

        return location;
    } catch (error) {
        throw new Error('Не вдалося створити локацію: ' + error.message);
    }
};

const updateLocationById = async (id, lat,lon) => {
    try {
        const location = await Location.findByPk(id);
        if (!location) {
            throw new Error('Локацію не знайдено');
        }

        const locationData = await getInformationByData(lat, lon);
        return await location.update(locationData);
    } catch (error) {
        throw new Error('Не вдалося оновити локацію: ' + error.message);
    }
};

const deleteLocationById = async (id) => {
    try {
        const location = await Location.findByPk(id);
        if (!location) {
            throw new Error('Локацію не знайдено');
        }
        await location.destroy();
        return { message: 'Локацію успішно видалено' };
    } catch (error) {
        throw new Error('Не вдалося видалити локацію: ' + error.message);
    }
};


const getUniqueCities = async () => {
    try {
        const cities = await Location.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']], raw: true });
        return cities.map(city => city.city).filter(city => city);
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні міста: ' + error.message);
    }
};

const getUniqueCountries = async () => {
    try {
        const countries = await Location.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('country')), 'country']], raw: true });
        return countries.map(country => country.country).filter(country => country);
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні країни: ' + error.message);
    }
};

const getUniqueBoroughs = async () => {
    try {
        const boroughs = await Location.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('borough')), 'borough']], raw: true });
        return boroughs.map(borough => borough.borough).filter(borough => borough);
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні райони (boroughs): ' + error.message);
    }
};

const getUniqueDistricts = async () => {
    try {
        const districts = await Location.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('district')), 'district']], raw: true });
        return districts.map(district => district.district).filter(district => district);
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні округи (districts): ' + error.message);
    }
};

const getUniqueStates = async () => {
    try {
        const states = await Location.findAll({ attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('state')), 'state']], raw: true });
        return states.map(state => state.state).filter(state => state);
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні штати (states): ' + error.message);
    }
};

const getAllUniqueLocations = async () => {
    try {
        const [cities, countries, boroughs, districts, states] = await Promise.all([
            getUniqueCities(),
            getUniqueCountries(),
            getUniqueBoroughs(),
            getUniqueDistricts(),
            getUniqueStates()
        ]);
        return { cities, countries, boroughs, districts, states };
    } catch (error) {
        throw new Error('Не вдалося отримати унікальні локації: ' + error.message);
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocationById,
    deleteLocationById,
    getInformationByData,
    getUniqueCities,
    getUniqueCountries,
    getUniqueBoroughs,
    getUniqueDistricts,
    getUniqueStates,
    getAllUniqueLocations
};
