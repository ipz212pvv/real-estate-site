const { models } = require("./../models");

const getUserTypeInclude = () => ({
    model: models.UserType,
    as: 'userType',
});

const getUserInclude = (name) => ({
    model: models.User,
    as: name,
    attributes: { exclude: ['password'] },
    include: getUserTypeInclude(),
});

const getLocationInclude = (name) => ({
    model: models.Location,
    as: name,
});

const getBenefitsInclude = (name) => ({
    model: models.Benefits,
    as: name,
});

const getNearbyPlacesInclude = (name) => ({
    model: models.NearbyPlaces,
    as: name,
    include: getLocationInclude('locationForNearbyPlace'),
});

const getAdvertTypeInclude = () => ({
    model: models.AdvertType,
    as: "advertTypeForAdvert",
});
const getAdvertPropertyTypeInclude = () => ({
    model: models.AdvertPropertyType,
    as: "advertPropertyTypeForAdvert",
});

const getAdvertBenefitsInclude = () => ({
    model: models.AdvertBenefits,
    as: "advertBenefitsForAdvert",
    include: getBenefitsInclude('benefitForAdvert'),
});

const getAdvertNearbyPlacesInclude = () => ({
    model: models.AdvertNearbyPlaces,
    as: "advertNearbyPlacesForAdvert",
    include: getNearbyPlacesInclude('placeForAdvertNearby'),
});

const getAdvertImageInclude = () => ({
    model: models.AdvertImage,
    as: "advertImages"
});

const getComplaintUserInclude = () => ({
    model: models.User,
    as: "complaintUser",
    attributes: ["id", "name", "surname"],
});

const getComplaintAdvertInclude = () => ({
    model: models.Advert,
    as: "complaintAdvert",
    attributes: ["id", "title"],
});

module.exports = {
    getUserTypeInclude,
    getUserInclude,
    getLocationInclude,
    getAdvertTypeInclude,
    getBenefitsInclude,
    getAdvertBenefitsInclude,
    getAdvertImageInclude,
    getNearbyPlacesInclude,
    getAdvertNearbyPlacesInclude,
    getAdvertPropertyTypeInclude,
    getComplaintUserInclude,
    getComplaintAdvertInclude
};