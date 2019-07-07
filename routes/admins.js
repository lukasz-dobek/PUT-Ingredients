const express = require('express');
const argon2 = require('argon2');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Udalo sie');
});

module.exports = router;
