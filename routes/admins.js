const express = require('express');
const argon2 = require('argon2');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./admin_panel/main', { layout: 'layout_admin_panel'});
});

router.get('/user_management', (req, res) => {
    res.render('./admin_panel//user_management', { layout: 'layout_admin_panel'});
});

router.get('/recipe_management', (req, res) => {
    res.render('./admin_panel/recipe_management', { layout: 'layout_admin_panel'});
});

router.get('/user_management/details', (req, res) => {
    res.render('./admin_panel/recipe_management_details', { layout: 'layout_admin_panel'});
});

module.exports = router;
