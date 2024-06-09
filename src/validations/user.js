const Joi = require('joi');

const usernameSchema = Joi.string().trim().label('username');
const emailSchema = Joi.string().trim().email().label('email');
const passwordSchema = Joi.string().trim().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).label('password');
const firstNameSchema = Joi.string().trim().alphanum().label('firstName');
const lastNameSchema = Joi.string().trim().alphanum().label('lastName');
const roleSchema = Joi.string().trim().valid("admin", "student", "teacher").label('role');
const dateOfBirthSchema = Joi.string().trim().isoDate().label('dateOfBirth');
const nationalitySchema = Joi.string().trim().alphanum().label('nationality');
const subscriptionSchema = Joi.string().trim().alphanum().valid("free", "standard", "premium", "corporate").label('subscription');
const verifiedSchema = Joi.boolean().label('verified');
const verifiedTokenSchema = Joi.string().trim().allow(null).label('verifiedToken');

const creationSchema = Joi.object({
    email: emailSchema, 
    firstName: firstNameSchema, 
    lastName: lastNameSchema, 
    password: passwordSchema,
    role: roleSchema, 
    dateOfBirth: dateOfBirthSchema, 
    nationality: nationalitySchema
});

const updateSchema = Joi.object({
    email: emailSchema, 
    firstName: firstNameSchema, 
    lastName: lastNameSchema, 
    dateOfBirth: dateOfBirthSchema, 
    nationality: nationalitySchema, 
    username: usernameSchema,
    subscription: subscriptionSchema,
    verified: verifiedSchema,
    verifiedToken: verifiedTokenSchema
});

const loginSchema = Joi.object({
    identifier: Joi.alternatives().try(emailSchema, usernameSchema),
    password: passwordSchema
});

const changePasswordSchema = Joi.object({
    oldPassword: passwordSchema, 
    newPassword: passwordSchema 
});

exports.userInfo = (req, res, next) => {
    try {
        const { error } = creationSchema.validate(req.body, { presence: 'required', abortEarly: true });
        if(error)
            throw error;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};

exports.updateUserInfo = (req, res, next) => {
    try {
        const { error, value } = updateSchema.validate(req.body, { presence: 'optional', abortEarly: true });
        if(error)
            throw error;
        req.validatedBody = value;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};

exports.loginValidation = (req, res, next) => {
    try {
        const { error } = loginSchema.validate(req.body, { presence: 'required', abortEarly: true });
        if(error)
            throw error;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};

exports.changePasswordValidation = (req, res, next) => {
    try {
        const { error } = changePasswordSchema.validate(req.body, { presence: 'required', abortEarly: true });
        if(error)
            throw error;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};