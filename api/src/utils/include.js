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

const getAdvertCommentInclude = () => ({
    model: models.AdvertComment,
    as: "advertComments",
    include: getUserInclude( "userForComment")
})

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
    getAdvertCommentInclude,
    getAdvertPropertyTypeInclude
};