const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');

router.get('/', (req, res) => {
    let recipes;
    pgClient.query('SELECT * FROM recipes', (err, result) => {
        if (err) throw err;
        recipes = result.rows;
        console.log(recipes[0]['recipe_name']);
        console.log(typeof recipes);
    });


    res.render('mainpage',{scriptName: '/javascripts/script.js'});
});

router.get('/search/name', (req, res) => {
    console.log(req.query['searchRecipeName']);
    res.render('recipe_search_name', {recipeName: req.query['searchRecipeName'], scriptName: '/javascripts/script_recipe_search_name.js'});
})

router.get('/api/all', (req, res) => {
    pgClient.query('SELECT r.*, u.nickname FROM recipes r JOIN users u ON u.id_user = r.user_id JOIN categories_per_recipe cpr ON cpr.recipe_id = r.id_recipe JOIN categories c ON cpr.category_id = c.id_category GROUP BY r.id_recipe', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/api/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM recipes WHERE id_recipe = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) =>{
        if (err) throw err;
        res.json(result.rows);
    });
});

router.get('/api/name/:name', (req, res) => {
    const queryString = "SELECT * FROM recipes WHERE LOWER(recipe_name) LIKE $1";
    console.log([req.params.name]);
    const value = req.params.name;

    pgClient.query(queryString, ['%' + value + '%'], (err, result) =>{
        if (err) throw err;
        res.json(result.rows);
    });
});


module.exports = router;