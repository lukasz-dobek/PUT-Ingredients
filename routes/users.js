const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');
const { ensureLoggedIn } = require('../config/auth');

router.get('/user_settings', (req, res) => {
    res.render('./users/user_settings');
});

router.get('/user_recipes', (req, res) => {
    res.render('./users/user_recipes');
});

module.exports = router;
