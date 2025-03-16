const Joi = require("joi");

const createJobSchema = Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required(),
    description: Joi.string().required(),
    skills: Joi.array().required(),
});

const applyJobSchema = Joi.object({
    jobId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    resumeLink: Joi.string().required(),
});

module.exports = { createJobSchema, applyJobSchema };