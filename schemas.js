const Joi = require('joi');
module.exports.pinkcampaignSchema = Joi.object({
    pinkcampaign: Joi.object({
        title: Joi.string().required(),
        city: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.date().required(),
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});