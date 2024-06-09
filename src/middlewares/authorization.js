const { verifyToken } = require('../utils/jwt');

const userService = require('../services/user');

exports.authorize = (roles = []) => {
    return async (req, res, next) => {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Token not found' });
        }
        token = token.split(' ')[1];
        const user = verifyToken(token);
        if (user.error) {
            return res.status(401).json({ error: user.error });
        }
        const userRecord = await userService.getOne(user.id);
        if (!userRecord) {
            return res.status(404).json({ error: 'Invalid Token! User not found' });
        }
        if (roles.length && !roles.includes(userRecord.role)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        req.user = userRecord;
        next();
    };
};
