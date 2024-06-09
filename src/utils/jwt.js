const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.generateToken = (payload) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        const expiration = process.env.JWT_EXPIRATION;
        return jwt.sign(payload, secretKey, { expiresIn: expiration });
    } catch (error) {
        console.log(error);
        return;
    }
}

exports.verifyToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET;
        return jwt.verify(token, secretKey);
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
            return { error: 'Token expired' };
        } else if (error instanceof jwt.JsonWebTokenError) {
            return { error: 'Invalid token' };
        } else {
            return { error: 'Internal server error' };
        }
    }
};