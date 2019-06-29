const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    pgClient.query('SELECT * FROM recipes ORDER BY date_of_creation LIMIT 9', (err, result) => {
        if (err) throw err;
        res.render('./recipes/front_page', { recipes: result.rows, user: req.user['email_address'] });
    });
});

router.get('/add_new_recipe', (req, res) => {
    res.render('./recipes/add_new_recipe');
});

router.get('/add_recipe_confirmation', (req, res) => { 
    res.render('./recipes/add_recipe_confirmation');
});

router.get('/old', (req, res) => {
    let recipes;
    pgClient.query('SELECT * FROM recipes', (err, result) => {
        if (err) throw err;
        recipes = result.rows;
    });
    res.render('./recipes/front_page_old', { scriptName: '/javascripts/script.js' });
});

router.get('/:linkToRecipe', (req,res) => {
    // maybe save link to recipe in database aswell?
    // if we're talking about that, remember that we need photo 1 photo 2 and photo 3 columns aswell
    // select '/recipes/' || replace(lower(recipe_name), ' ', '_') as url from recipes;
    const recipeQueryString = "SELECT * FROM recipes WHERE link_to_recipe LIKE $1;";
    const ingredientsQueryString = `SELECT b.ingredient_name, a.amount, c.name 
    FROM ingredients_used_in_recipe a 
    INNER JOIN ingredients b ON a.ingredient_id = b.id_ingredient 
    INNER JOIN units c ON a.unit_id = c.id_unit 
    WHERE recipe_id = $1;`

    const linkToRecipe = '/recipes/'.concat(req.params.linkToRecipe);

    pgClient.query(recipeQueryString, [linkToRecipe], (recipeQueryError, recipeQueryResult) => {
        if (recipeQueryError) throw recipeQueryError;
        const recipeId = recipeQueryResult.rows[0]["id_recipe"];
        pgClient.query(ingredientsQueryString, [recipeId], (ingredientsQueryError, ingredientsQueryResult) => {
            if (ingredientsQueryError) throw ingredientsQueryError;
            // Ingredients fields: ingredient_name, amount, name (unit name - might need to change that in database later)
            res.render('./recipes/recipe_page', { recipe: recipeQueryResult.rows, ingredients: ingredientsQueryResult.rows});
        });
    });
});

router.get('/search/name', (req, res) => {
    // TODO: rewrite query so it also includes user_id
    const queryString = "SELECT * FROM recipes WHERE LOWER(recipe_name) LIKE $1;";
    const value = req.query['searchRecipeName'];

    pgClient.query(queryString, ['%' + value + '%'], (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        res.render('./recipes/recipe_search_name', { searchString: value, recipes: result.rows });
    });
});

router.get('/search/categories', (req, res) => {
    // Read values from categories form
    var arr = req.query['categories-checkboxes'];

    // Check if there is more than one value passed by form
    if (!Array.isArray(arr)) {
        // If there isn't, push existing values to empty array
        var ops = [];
        ops.push(arr);
    } else {
        // If there is, copy values to new array
        var ops = arr;
    }

    // Determine how many parameters are needed in PG Query - for each create $i string
    var params = [];
    for (var i = 1; i <= ops.length; i++) {
        params.push('$' + i);
    }

    // Generate query string with $i's
    // TODO: rewrite query so it also includes user_id
    const queryString = `SELECT DISTINCT ON (r.recipe_name) recipe_name, r.*, cpr.recipe_id, cpr.category_id, c.category_name FROM recipes r 
    JOIN categories_per_recipe cpr ON cpr.recipe_id = r.id_recipe
    JOIN categories c ON cpr.category_id = c.id_category
    WHERE c.category_name IN (${params.join(',')})`;

    // Query PostgreSQL - ops have to be an array (even if there is only one value within)
    pgClient.query(queryString, ops, (err, result) => {
        if (err) throw err;
        res.render('./recipes/recipe_search_categories', { searchedCategories: ops, recipes: result.rows });
    });

});



router.get('/api/all', (req, res) => {
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

router.get('/api/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM recipes WHERE id_recipe = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

router.get('/api/name/:name', (req, res) => {
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