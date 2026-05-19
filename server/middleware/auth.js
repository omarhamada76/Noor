const jwt = require('jsonwebtoken');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'noor_secret_fallback');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token is invalid or expired.' });
  }
};
