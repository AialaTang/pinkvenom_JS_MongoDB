const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePinkcampaign } = require('../middleware');
const pinkcampaigns = require('../controllers/pinkcampaigns');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(pinkcampaigns.index))
    .post(isLoggedIn, upload.array('image'), validatePinkcampaign, catchAsync(pinkcampaigns.createPinkcampaign))

router.get('/new', isLoggedIn, pinkcampaigns.renderNewForm)

router.route('/:id')
    .get(catchAsync(pinkcampaigns.showPinkcampaign))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePinkcampaign, catchAsync(pinkcampaigns.updatePinkcampaign))
    .delete(isLoggedIn, isAuthor, catchAsync(pinkcampaigns.deletePinkcampaign))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(pinkcampaigns.renderEditForm))



module.exports = router;
