const Joi = require('joi');

const customMessages = {
    'string.base': '{#label} should be a type of text',
    'string.empty': '{#label} cannot be an empty field',
    'string.min': '{#label} should have a minimum length of {#limit}',
    'string.max': '{#label} should have a maximum length of {#limit}',
    'any.required': '{#label} is a required field',
    'string.alphanum': '{#label} should only contain alphanumeric characters',
    'string.pattern.base': '{#label} must start with a letter',
    'number.base': '{#label} should be a type of number',
    'number.min': '{#label} should have a minimum value of {#limit}',
    'any.only': '{#label} must be one of {#valids}',
    'date.isoDate': '{#label} must be a valid ISO date'
};


const usernameSchema = Joi.string().trim().label('Username').messages(customMessages);
const emailSchema = Joi.string().trim().email().label('Email').messages(customMessages);
const passwordSchema = Joi.string().trim().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).label('Password').messages({
    ...customMessages,
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
});
const firstNameSchema = Joi.string().trim().alphanum().label('First Name').messages(customMessages);
const lastNameSchema = Joi.string().trim().alphanum().label('Last Name').messages(customMessages);
const roleSchema = Joi.string().trim().valid("admin", "student", "teacher").label('Role').messages(customMessages);
const dateOfBirthSchema = Joi.string().trim().isoDate().label('Date of Birth').messages(customMessages);
const nationalitySchema = Joi.string().trim().alphanum().label('Nationality').messages(customMessages);
const subscriptionSchema = Joi.string().trim().alphanum().valid("free", "standard", "premium", "corporate").label('Subscription').messages(customMessages);
const verifiedSchema = Joi.boolean().label('Verified').messages(customMessages);
const verifiedTokenSchema = Joi.string().trim().allow(null).label('Verified Token').messages(customMessages);

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
    identifier: Joi.alternatives().try(emailSchema, usernameSchema).label('Identifier').messages(customMessages),
    password: passwordSchema
});

const changePasswordSchema = Joi.object({
    oldPassword: passwordSchema.label('Old Password').messages(customMessages),
    newPassword: passwordSchema.label('New Password').messages(customMessages)
});

exports.userInfo = (req, res, next) => {
    const { error } = creationSchema.validate(req.body, { presence: 'required', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.updateUserInfo = (req, res, next) => {
    const { error, value } = updateSchema.validate(req.body, { presence: 'optional', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedBody = value;
    next();
};

exports.loginValidation = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { presence: 'required', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.changePasswordValidation = (req, res, next) => {
    const { error } = changePasswordSchema.validate(req.body, { presence: 'required', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};