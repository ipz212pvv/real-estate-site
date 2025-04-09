const userRepository = require('./userRepository');
const benefitsRepository = require('./benefitsRepository');
const advertTypeRepository = require('./advertTypeRepository');
const userTypeRepository = require('./userTypeRepository');
const locationRepository = require('./locationRepository');
const nearbyPlacesRepository = require('./nearbyPlacesRepository');
const complaintRepository = require('./complaintRepository');
const advertImageRepository = require('./advertImageRepository');
const likedAdvertisementRepository = require('./likedAdvertisementRepository');
const advertBenefitsRepository = require('./advertBenefitsRepository');
const advertNearbyPlacesRepository = require('./advertNearbyPlacesRepository');
const advertRepository = require('./advertRepository');
const advertCommentRepository = require('./advertCommentRepository');
const advertPropertyTypeRepository = require('./advertPropertyTypeRepository');

module.exports = {
    advertCommentRepository,
    userRepository,
    benefitsRepository,
    advertTypeRepository,
    userTypeRepository,
    nearbyPlacesRepository,
    locationRepository,
    complaintRepository,
    likedAdvertisementRepository,
    advertBenefitsRepository,
    advertNearbyPlacesRepository,
    advertRepository,
    advertPropertyTypeRepository,
    advertImageRepository
};
