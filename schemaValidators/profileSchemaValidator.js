const Joi = require('joi');

// Joi schema to validate student data
const validateProfileSchema = Joi.object({
    studName: Joi.string()
        .uppercase()
        .required()
        .messages({
            'string.empty': 'Student name is required.',
            'any.required': 'Student name is required.',
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required.',
            'any.required': 'Password is required.',
        }),

    studMobile: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .messages({
            'string.pattern.base': 'Mobile number must be exactly 10 digits long.',
        }),

    studBranch: Joi.string()
        .lowercase()
        .valid("information technology", "computer engineering", "mechanical engineering")
        .required()
        .messages({
            'any.required': 'Branch is required.',
            'string.empty': 'Branch is required.',
        }),

    studCourse: Joi.string()
        .lowercase()
        .valid("diploma", "degree")
        .required()
        .messages({
            'any.required': 'Course is required.',
            'string.empty': 'Course is required.',
        }),

    studEnrollNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
        'string.pattern.base': 'Enroll number must be exactly 10 digits long.',
    }),

    studYear: Joi.string()
        .uppercase()
        .valid("FY", "SY", "TY")
        .required()
        .messages({
            'any.required': 'Year is required.',
            'string.empty': 'Year is required.',
        }),

    studPic: Joi.string()
        .default('/assets/profilePic.jpg')  // Default value
        .required()                         // Ensures the field is required
        .messages({
            'string.empty': 'Profile picture is required.',
            'any.required': 'Profile picture is required.',
        }),

    studResume: Joi.array()
        .items(Joi.string())
        .messages({
            'array.base': 'Resume must be an array of strings.',
        }),

    programmingLanguages: Joi.array()
        .items(Joi.string().uppercase())
        .messages({
            'array.base': 'Programming languages must be an array of strings.',
        }),

    skills: Joi.array()
        .items(Joi.string().uppercase())
        .messages({
            'array.base': 'Skills must be an array of strings.',
        }),

    projects: Joi.array()
        .items(Joi.string().guid({ version: 'uuidv4' })) // Assuming projects are stored as ObjectIds or GUIDs
        .messages({
            'array.base': 'Projects must be an array of valid project references.',
        }),
});

module.exports = validateProfileSchema;
