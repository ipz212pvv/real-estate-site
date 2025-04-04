const { models } = require('../models');
const { getDecodedTokenFromHeader } = require("../utils/token");

const ownerMiddleware  = (field = "advert") =>  {
  return async (req, res, next) => {
    try {
      let advertId = null;
      const  decoded = getDecodedTokenFromHeader(req);
      if(field === "advert"){
        advertId = req.body.advertId || req.params.id;
      }else if(field === "advertBenefits"){
        const advertBenefits= await models.AdvertBenefits.findByPk(req.params.id);
        advertId = advertBenefits.advertId;
      }else if(field === "advertImage"){
        const advertImage= await models.AdvertImage.findByPk(req.params.id);
        advertId = advertImage.advertId;
      }

      const advert = await models.Advert.findByPk(advertId);

      if (!advert) {
        return res.status(404).json({
          message: 'Оголошення не знайдено'
        });
      }

      if (decoded.role !== 'admin' && advert.userId !== decoded.id) {
        return res.status(403).json({
          message: 'Дія заборонена'
        });
      }

      req.advert = advert;
      next();
    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }
};

module.exports = ownerMiddleware;