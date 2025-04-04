const { models } = require("../models");
const { getDecodedTokenFromHeader } = require('../utils/token');

const checkUserMiddleware = async (req, res, next) => {
  try {
    const  decoded = getDecodedTokenFromHeader(req);
    const userId = req.params.id||req.params.userId;
    const user = await models.User.findOne({ where: { id:userId } });

    if (!user) {
      return res.status(404).json({ message: 'Такого юзера не існує' });
    }

    if (decoded.role !== 'admin'&&decoded.id !== user.id) {
      return res.status(403).json({ message: 'У вас немає доступу до цього ресурсу' });
    }

    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = checkUserMiddleware;