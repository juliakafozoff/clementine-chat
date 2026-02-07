const jwt = require('../utils/jwt');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('No token provided');
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verifyToken(token);
    
    if (!decoded) {
        return res.status(401).send('Invalid or expired token');
    }
    
    req.userId = decoded.userId;
    next();
};

module.exports = { authenticate };

