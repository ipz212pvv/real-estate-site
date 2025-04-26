const setupAssociations = (models) => {
    const { User, UserType, Location, NearbyPlaces,
        Advert, AdvertType, Complaint, AdvertImage,
         AdvertBenefits, Benefits,
        AdvertNearbyPlaces,AdvertPropertyType } = models;

    User.belongsTo(UserType, {
        foreignKey: 'userTypeId',
        as: 'userType',
    });

    UserType.hasMany(User, {
        foreignKey: 'userTypeId',
        as: 'users',
    });

    NearbyPlaces.belongsTo(Location, {
        foreignKey: 'locationId',
        as: 'locationForNearbyPlace',
    });

    Location.hasMany(NearbyPlaces, {
        foreignKey: 'locationId',
        as: 'nearbyPlacesForLocation',
    });

    Advert.belongsTo(User, {
        foreignKey: 'userId',
        as: 'userOfAdvert',
    });

    User.hasMany(Advert, {
        foreignKey: 'userId',
        as: 'advertsOfUser',
    });

    Advert.belongsTo(AdvertType, {
        foreignKey: 'typeId',
        as: 'advertTypeForAdvert',
    });

    AdvertType.hasMany(Advert, {
        foreignKey: 'typeId',
        as: 'advertsOfAdvertType',
    });

    Advert.belongsTo(AdvertPropertyType, {
        foreignKey: 'propertyTypeId',
        as: 'advertPropertyTypeForAdvert',
    });

    AdvertPropertyType.hasMany(Advert, {
        foreignKey: 'propertyTypeId',
        as: 'advertsOfAdvertPropertyType',
    });

    Advert.belongsTo(Location, {
        foreignKey: 'locationId',
        as: 'locationForAdvert',
    });

    Location.hasMany(Advert, {
        foreignKey: 'locationId',
        as: 'advertsForLocation',
    });

    Complaint.belongsTo(User, {
        foreignKey: 'userId',
        as: 'complaintUser',
        onDelete: 'CASCADE',
    });

    User.hasMany(Complaint, {
        foreignKey: 'userId',
        as: 'userComplaints',
        onDelete: 'CASCADE',
    });

    Complaint.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'complaintAdvert',
        onDelete: 'CASCADE',
    });

    Advert.hasMany(Complaint, {
        foreignKey: 'advertId',
        as: 'advertComplaints',
        onDelete: 'CASCADE',
    });

    Advert.hasMany(AdvertImage, {
        foreignKey: 'advertId',
        as: 'advertImages',
    });

    AdvertImage.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'imageForAdvert',
    });

    Advert.hasMany(AdvertBenefits, {
        foreignKey: 'advertId',
        as: 'advertBenefitsForAdvert',
    });

    AdvertBenefits.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'advertForBenefit',
    });

    Benefits.hasMany(AdvertBenefits, {
        foreignKey: 'benefitId',
        as: 'advertBenefitsForBenefit',
    });

    AdvertBenefits.belongsTo(Benefits, {
        foreignKey: 'benefitId',
        as: 'benefitForAdvert',
    });

    Advert.hasMany(AdvertNearbyPlaces, {
        foreignKey: 'advertId',
        as: 'advertNearbyPlacesForAdvert',
    });

    AdvertNearbyPlaces.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'advertForNearbyPlace',
    });

    NearbyPlaces.hasMany(AdvertNearbyPlaces, {
        foreignKey: 'nearbyPlaceId',
        as: 'advertNearbyPlacesForPlace',
    });

    AdvertNearbyPlaces.belongsTo(NearbyPlaces, {
        foreignKey: 'nearbyPlaceId',
        as: 'placeForAdvertNearby',
    });
};

module.exports = setupAssociations;
