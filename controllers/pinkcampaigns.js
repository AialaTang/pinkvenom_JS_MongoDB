const { model } = require('mongoose');
const Pinkcampaign = require('../models/pinkcampaign');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const pinkcampaigns = await Pinkcampaign.find({})
    res.render('pinkcampaigns/index', { pinkcampaigns })
};

module.exports.renderNewForm = (req, res) => {
    res.render('pinkcampaigns/new')
};

module.exports.createPinkcampaign = async (req, res, next) => {
    const pinkcampaign = new Pinkcampaign(req.body.pinkcampaign)
    pinkcampaign.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    pinkcampaign.author = req.user._id
    await pinkcampaign.save()
    req.flash('success', 'Successfully made a new pinkcampaign!')
    res.redirect(`/pinkcampaigns/${pinkcampaign._id}`)
};

module.exports.showPinkcampaign = async (req, res) => {
    const pinkcampaign = await Pinkcampaign.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author')
    if (!pinkcampaign) {
        req.flash('error', 'Cannot find that pinkcampaign!!')
        return res.redirect('/pinkcampaigns')
    }
    res.render('pinkcampaigns/show', { pinkcampaign })
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const pinkcampaign = await Pinkcampaign.findById(id)
    if (!pinkcampaign) {
        req.flash('error', 'Cannot find that pinkcampaign!!')
        return res.redirect('/pinkcampaigns')
    }
    res.render('pinkcampaigns/edit', { pinkcampaign })
};

module.exports.updatePinkcampaign = async (req, res) => {
    const { id } = req.params
    const pinkcampaign = await Pinkcampaign.findByIdAndUpdate(id, { ...req.body.pinkcampaign })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    pinkcampaign.images.push(...imgs)
    await pinkcampaign.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await pinkcampaign.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(pinkcampaign)
    }
    req.flash('success', 'Successfully Updated Pinkcampaign!')
    res.redirect(`/pinkcampaigns/${pinkcampaign._id}`)
};

module.exports.deletePinkcampaign = async (req, res) => {
    const { id } = req.params
    const pinkcampaign = await Pinkcampaign.findById(id)
    await Pinkcampaign.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted pinkcampaign')
    res.redirect('/pinkcampaigns')
};