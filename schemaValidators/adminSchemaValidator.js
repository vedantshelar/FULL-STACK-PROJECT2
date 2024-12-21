const Joi = require('joi');

const validateAdminSchema = Joi.object({
    adminEmail: Joi.string()
      .email() // Validates email format
      .required()
      .messages({
        'string.email': 'Admin email must be a valid email address.',
        'any.required': 'Admin email is required.',
      }),
  
    adminPassword: Joi.string()
      .required()
      .messages({
        'string.empty': 'Admin password is required.',
        'any.required': 'Admin password is required.',
      }),
  
    adminMobileNo: Joi.string()
      .pattern(/^\d{10}$/) // Ensures exactly 10 digits
      .required()
      .messages({
        'string.pattern.base': 'Admin mobile number must be exactly 10 digits.',
        'any.required': 'Admin mobile number is required.',
      }),
  });

module.exports = validateAdminSchema;