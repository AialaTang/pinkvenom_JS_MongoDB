const Pinkcampaign = require('../models/pinkcampaign');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params
    const pinkcampaign = await Pinkcampaign.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    pinkcampaign.reviews.push(review)
    await review.save()
    await pinkcampaign.save()
    req.flash('success', 'Creared new reivew!')
    res.redirect(`/pinkcampaigns/${pinkcampaign._id}`)
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params
    await Pinkcampaign.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/pinkcampaigns/${id}`)
};