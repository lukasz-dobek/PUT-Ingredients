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

router.get('/:linkToRecipe', (req, res) => {

    const recipeQueryString = `SELECT 
	rec.id_recipe, 
	rec.recipe_name, 
	rec.score, 
	rec.date_of_creation, 
	rec.complicity, 
	rec.preparation_time, 
	rec.description, 
	rec.number_of_people, 
	rec.link_to_recipe, 
	rec.photo_one, 
	rec.photo_two, 
	rec.photo_three, 
	rec.photo_four,
	usr.email_address,
	usr.nickname
    FROM recipes rec INNER JOIN users usr ON rec.user_id = usr.id_user WHERE rec.link_to_recipe LIKE $1;`;

    const ingredientsQueryString = `SELECT b.ingredient_name, a.amount, c.unit_name 
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
            /* 
            
            Recipe fields: id_recipe, recipe_name, score, date_of_creation, complicity, preparation_time, description
            number_of_people, link_to_recipe, photo_one, photo_two, photo_three, photo_four, email_address, nickname.

            Ingredients fields: ingredient_name, amount, unit_name.

            */
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

module.exports = router;