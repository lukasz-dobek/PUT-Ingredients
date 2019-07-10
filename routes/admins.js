const express = require('express');
const argon2 = require('argon2');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('./admin_panel/main', { layout: 'layout_admin_panel'});
});

module.exports = router;
