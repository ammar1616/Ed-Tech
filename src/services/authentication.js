const bcrypt = require('bcrypt');

const { generateToken } = require('../utils/jwt');

const userService = require('./user');

exports.login = async (identifier, password) => {
    try {
        const user = await userService.getOne(identifier, true);
        if (!user) {
            throw new Error('User not found');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Invalid password');
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = generateToken(payload);
        if (!token) {
            throw new Error('Token generation failed');
        }
        user.password = undefined;
        return { token, user };
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
};