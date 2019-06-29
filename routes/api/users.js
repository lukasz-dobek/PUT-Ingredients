const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/all', (req, res) => {
    pgClient.query('SELECT * FROM users', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM users WHERE id_user = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

module.exports = router;