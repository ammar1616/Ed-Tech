const Joi = require('joi');

const courseCategories = [
    "Programming Languages",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Software Design",
    "Data Science"
];

const codeSchema = Joi.string().trim().alphanum().min(4).max(10).label('code');
const nameSchema = Joi.string().trim().min(2).label('name');
const descriptionSchema = Joi.string().trim().min(10).label('description');
const categorySchema = Joi.string().trim().valid(...courseCategories).label('category');
//const materials = Joi.string()
const instructorSchema = Joi.number().integer().label('instructor');
const durationSchema = Joi.number().integer().min(1).label('duration');
const levelSchema = Joi.string().trim().valid("Beginner", "Intermediate", "Advanced").label('level');
const sectionsSchema = Joi.number().integer().min(1).label('sections');
const statusSchema = Joi.string().trim().valid("pending", "approved").label('status');

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
    try {
        const { error } = createCourseSchema.validate(req.body, { presence: 'required', abortEarly: true });
        if(error)
            throw error;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};

exports.updateCourseInfo = (req, res, next) => {
    try {
        const { error, value } = updateCourseSchema.validate(req.body, { presence: 'optional', abortEarly: true });
        if(error)
            throw error;
        req.validatedBody = value;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.details[0].message });
    }
};