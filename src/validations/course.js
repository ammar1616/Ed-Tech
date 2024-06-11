const Joi = require('joi');

const courseCategories = [
    "Programming Languages",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Software Design",
    "Data Science"
];

// Custom validation messages
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

const codeSchema = Joi.string().trim().alphanum().min(4).max(10).label('Code').pattern(/^[A-Za-z]/).messages(customMessages);
const nameSchema = Joi.string().trim().min(2).label('Name').messages(customMessages);
const descriptionSchema = Joi.string().trim().min(10).label('Description').messages(customMessages);
const categorySchema = Joi.string().trim().valid(...courseCategories).label('Category').messages(customMessages);
const instructorSchema = Joi.number().integer().label('Instructor').messages(customMessages);
const durationSchema = Joi.number().integer().min(1).label('Duration').messages(customMessages);
const levelSchema = Joi.string().trim().valid("Beginner", "Intermediate", "Advanced").label('Level').messages(customMessages);
const sectionsSchema = Joi.number().integer().min(1).label('Sections').messages(customMessages);
const statusSchema = Joi.string().trim().valid("pending", "approved").label('Status').messages(customMessages);

const createCourseSchema = Joi.object({
    name: nameSchema,
    code: codeSchema,
    description: descriptionSchema,
    category: categorySchema,
    instructor: instructorSchema,
    duration: durationSchema,
    level: levelSchema,
    sections: sectionsSchema
});

const updateCourseSchema = Joi.object({
    name: nameSchema,
    code: codeSchema,
    description: descriptionSchema,
    category: categorySchema,
    instructor: instructorSchema,
    duration: durationSchema,
    level: levelSchema,
    sections: sectionsSchema,
    status: statusSchema
});

exports.courseInfo = (req, res, next) => {
    const { error } = createCourseSchema.validate(req.body, { presence: 'required', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

exports.updateCourseInfo = (req, res, next) => {
    const { error, value } = updateCourseSchema.validate(req.body, { presence: 'optional', abortEarly: true });
    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedBody = value;
    next();
};