const jwt = require('jsonwebtoken');

const getTokenFromHeader = (req) => {
  const authHeader = req.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
};

const getDecodedTokenFromHeader = (req) => {
    const token = getTokenFromHeader(req);

    if (!token) {
        throw new Error('Жетон не надано');
    }

    return jwt.verify(token, process.env.JWT_SECRET);
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn:  process.env.JWT_EXPIRES_IN }
  );
};

module.exports = {
  getTokenFromHeader,
  generateToken,
    getDecodedTokenFromHeader
};