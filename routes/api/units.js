const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/names', (req, res) => {
    pgClient.query('SELECT unit_name FROM units;', (err, result) => {
        res.json(result.rows);
    });
});

module.exports = router;