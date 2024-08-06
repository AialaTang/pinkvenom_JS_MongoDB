const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(storeReturnTo, catchAsync(users.register))

router.route('/login')
    .get(users.renderLoggin)
    .post(storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loggin)

router.get('/logout', users.logout)

module.exports = router;

