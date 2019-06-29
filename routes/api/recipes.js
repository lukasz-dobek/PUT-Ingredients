const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/all', (req, res) => {
    let getAllRecipes = `SELECT r.*, u.nickname
    FROM recipes r JOIN users u ON u.id_user = r.user_id
    JOIN categories_per_recipe cpr ON cpr.recipe_id = r.id_recipe
    JOIN categories c ON cpr.category_id = c.id_category
    GROUP BY r.id_recipe, u.nickname
    ORDER BY date_of_creation`;
    pgClient.query(getAllRecipes, (err, result) => {
        res.json(result.rows);
    });
});

router.get('/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM recipes WHERE id_recipe = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

router.get('/name/:name', (req, res) => {
    const queryString = "SELECT * FROM recipes WHERE LOWER(recipe_name) LIKE $1";
    console.log([req.params.name]);
    const value = req.params.name;

    pgClient.query(queryString, ['%' + value + '%'], (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        res.json(result.rows);
    });
});

module.exports = router;