const { models } = require('../models');
const { getDecodedTokenFromHeader } = require('../utils/token');

const authMiddleware = async (req, res, next) => {
    try {
        const  decodedToken = getDecodedTokenFromHeader(req);

        const user = await models.User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ message: 'Пошта або пароль вказано невірно' });
        }

        if (user.isBlocked) {
            return res.status(401).json({ message: 'Ваш обліковий запис заблоковано' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Недійсний або прострочений маркер' });
    }
};

module.exports = authMiddleware;
