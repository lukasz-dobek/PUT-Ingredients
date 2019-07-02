const express = require('express');
const pgClient = require('../../db/pg-controller');
const router = express.Router();

router.get('/names', (req, res) => {
    const ingredientsNamesQueryString = "SELECT ingredient_name FROM ingredients;";
    pgClient.query(ingredientsNamesQueryString, (ingredientsNamesQueryError, ingredientsNamesQueryResult) => {
        if(ingredientsNamesQueryError) {
            throw ingredientsNamesQueryError;
        }
        res.json(ingredientsNamesQueryResult.rows);
    });
});

module.exports = router;