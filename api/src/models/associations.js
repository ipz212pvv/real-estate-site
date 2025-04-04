const setupAssociations = (models) => {
    const { User, UserType, Location, NearbyPlaces,
        Advert, AdvertType, Complaint, AdvertImage,
        LikedAdvertisement, AdvertBenefits, Benefits,
        AdvertNearbyPlaces, AdvertComment } = models;

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
    });

    User.hasMany(Complaint, {
        foreignKey: 'userId',
        as: 'userComplaints',
    });

    Complaint.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'complaintAdvert',
    });

    Advert.hasMany(Complaint, {
        foreignKey: 'advertId',
        as: 'advertComplaints',
    });

    Advert.hasMany(AdvertImage, {
        foreignKey: 'advertId',
        as: 'advertImages',
    });

    AdvertImage.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'imageForAdvert',
    });

    User.hasMany(LikedAdvertisement, {
        foreignKey: 'userId',
        as: 'likedAdvertsByUser',
    });

    LikedAdvertisement.belongsTo(User, {
        foreignKey: 'userId',
        as: 'likedByUser',
    });

    Advert.hasMany(LikedAdvertisement, {
        foreignKey: 'advertId',
        as: 'likedByAdvert',
    });

    LikedAdvertisement.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'advertLiked',
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

    Advert.hasMany(AdvertComment, {
        foreignKey: 'advertId',
        as: 'advertComments',
    });

    AdvertComment.belongsTo(Advert, {
        foreignKey: 'advertId',
        as: 'commentForAdvert',
    });

    User.hasMany(AdvertComment, {
        foreignKey: 'userId',
        as: 'userComments',
    });

    AdvertComment.belongsTo(User, {
        foreignKey: 'userId',
        as: 'userForComment',
    });

    AdvertComment.belongsTo(AdvertComment, {
        foreignKey: 'parentId',
        as: 'parentCommentForReply',
    });

    AdvertComment.hasMany(AdvertComment, {
        foreignKey: 'parentId',
        as: 'repliesForComment',
    });
};

module.exports = setupAssociations;