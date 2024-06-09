const authenticationService = require('../services/authentication');

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const response = await authenticationService.login(identifier, password);
        if (response.error) {
            return res.status(400).json({ error: response.error });
        }
        res.json({ message: 'Login successful', token: response.token, user: response.user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};