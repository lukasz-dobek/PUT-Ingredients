const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/recipes_in_month', (req, res) => {
    const recipesInMonthsQueryString = `
    SELECT 
        date_part('day', date_trunc('day', date_of_creation)) AS day,
        count(*) AS number_of_recipes
    FROM recipes
    WHERE date_of_creation > now() - interval '1 month' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(recipesInMonthsQueryString, (recipesInMonthsQueryError, recipesInMonthsQueryResult) => {
        if (recipesInMonthsQueryError) {
            throw recipesInMonthsQueryError;
        }
        res.json(recipesInMonthsQueryResult.rows)
    });

});


module.exports = router;
