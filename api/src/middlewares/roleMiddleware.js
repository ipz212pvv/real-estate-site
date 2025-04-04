const { getDecodedTokenFromHeader } = require('../utils/token');

const roleMiddleware = (requiredRole = 'admin') => {
  return async (req, res, next) => {
    try {
      const decoded = getDecodedTokenFromHeader(req);

      if (decoded.role!=='admin'&&decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Недійсний або прострочений маркер' });
    }
  };
};

module.exports = roleMiddleware;