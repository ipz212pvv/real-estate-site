const { sequelize } = require('../config/database');
const setupAssociations = require('./associations');
const User = require('./User');
const UserType = require('./UserType');
const AdvertType = require('./AdvertType');
const Benefits = require('./Benefits');
const Location = require('./Location');
const NearbyPlaces = require('./NearbyPlaces');
const Advert = require('./Advert');
const AdvertImage = require('./AdvertImage');
const Complaint = require('./Complaint');
const AdvertBenefits = require('./AdvertBenefits');
const AdvertNearbyPlaces = require('./AdvertNearbyPlaces');
const AdvertComment = require('./AdvertComment');
const AdvertPropertyType = require('./AdvertPropertyType');

const models = {
  User,
  UserType,
  AdvertType,
  Benefits,
  Location,
  NearbyPlaces,
  Advert,
  AdvertImage,
  Complaint,
  AdvertBenefits,
  AdvertNearbyPlaces,
  AdvertPropertyType,
  AdvertComment
};

setupAssociations(models);

module.exports = { sequelize, models };
