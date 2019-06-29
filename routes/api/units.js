const express = require('express');
const pgClient = require('../../db/pg-controller');
const router = express.Router();

router.get('/names', (req, res) => {
    const unitsNamesQueryString = "SELECT unit_name FROM units;";
    pgClient.query(unitsNamesQueryString, (unitsNamesQueryError, unitsNamesQueryResult) => {
        if(unitsNamesQueryError) {
            throw unitsNamesQueryError;
        }
        res.json(unitsNamesQueryResult.rows);
    });
});

module.exports = router;