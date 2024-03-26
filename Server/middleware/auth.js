const jwt = require('jsonwebtoken');
const User = require('../model/User');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRATE, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    try {
      const user = await User.findOne({ where: { email: decoded.email } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Error verifying user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

module.exports = verifyToken;
