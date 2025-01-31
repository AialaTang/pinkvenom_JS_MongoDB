const { pinkcampaignSchema, reviewSchema } = require('./schemas');
const Pinkcampaign = require('./models/pinkcampaign');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

module.exports.validatePinkcampaign = (req, res, next) => {
    const { error } = pinkcampaignSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You Must Signed Up!')
        return res.redirect('/login')
    } next()
};
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const pinkcampaign = await Pinkcampaign.findById(id)
    if (!pinkcampaign.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to do that')
        return res.redirect(`/pinkcampaigns/${id}`)
    }
    next()
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'you do not have permission to do that')
        return res.redirect(`/pinkcampaigns/${id}`)
    }
    next()
};