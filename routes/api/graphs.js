const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/', (req, res) => {
    res.send('temp');
});


module.exports = router;
