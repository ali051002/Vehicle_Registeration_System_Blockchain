const jwt = require('jsonwebtoken');

const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access Denied' });
            }

            req.user = decoded; 
            next();
        } catch (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};

module.exports = authorize;
