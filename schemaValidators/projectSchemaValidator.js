const Joi = require('joi');

const validateProjectSchema = Joi.object({
    projectName:Joi.string().min(2).max(100).required(),
    projectDescription:Joi.string().min(5).required(),
    projetGitHubLink:Joi.string(),
    owner: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    projectImgs:Joi.array().items(Joi.string())
}) 

module.exports = validateProjectSchema;