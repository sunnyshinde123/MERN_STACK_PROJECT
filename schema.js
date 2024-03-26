const Joi = require('joi');

module.exports.listingSchemaJoi=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        img:Joi.string().allow("",null),
        price:Joi.string().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required()
    }).required()
});

module.exports.reviewSchemaJoi=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required(),
    }).required()
})