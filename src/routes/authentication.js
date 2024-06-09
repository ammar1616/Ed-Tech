const router = require('express').Router();

const { login } = require('../controllers/authentication');
const { loginValidation } = require('./../validations/user');

router.post('/login', loginValidation, login);

module.exports = router;