const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, (req, res) => {
    const lastNineRecipesQueryString = "SELECT * FROM recipes ORDER BY date_of_creation LIMIT 9";
    pgClient.query(lastNineRecipesQueryString, (lastNineRecipesQueryError, lastNineRecipesQueryResult) => {
        if (lastNineRecipesQueryError) throw lastNineRecipesQueryError;
        res.render('./recipes/front_page', { 
            recipes: lastNineRecipesQueryResult.rows
        });
    });
});

router.get('/add_new_recipe', (req, res) => {
    res.render('./recipes/add_new_recipe');
});

router.get('/add_recipe_confirmation', (req, res) => { 
    res.render('./recipes/add_recipe_confirmation');
});

router.get('/:linkToRecipe', (req, res) => {
    const recipeQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation, 
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
    FROM recipes rec 
        INNER JOIN users usr ON rec.user_id = usr.id_user 
    WHERE rec.link_to_recipe LIKE $1;`;

    const ingredientsQueryString = `
    SELECT 
        ing.ingredient_name,
        iur.amount, 
        unt.unit_name 
    FROM ingredients_used_in_recipe iur 
	    INNER JOIN ingredients ing ON iur.ingredient_id = ing.id_ingredient 
	    INNER JOIN units unt ON iur.unit_id = unt.id_unit 
    WHERE iur.recipe_id = $1;`

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
            res.render('./recipes/recipe_page', { 
                recipe: recipeQueryResult.rows, 
                ingredients: ingredientsQueryResult.rows,
                user: req.user['email_address']
            });
        });
    });
});

// TODO: partial do wyswietlania listy znalezionych przepisow

router.get('/search/name', (req, res) => {
    const searchNameQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation, 
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
    FROM recipes rec 
        INNER JOIN users usr ON rec.user_id = usr.id_user     
    WHERE LOWER(recipe_name) LIKE $1;`;

    const searchRecipeName = req.query['searchRecipeName'].toLowerCase();

    pgClient.query(searchNameQueryString, ['%' + searchRecipeName + '%'], (searchNameQueryError, searchNameQueryResult) => {
        if (searchNameQueryError) throw searchNameQueryError;
        res.render('./recipes/recipe_search_name', { 
            searchString: searchRecipeName, 
            recipes: searchNameQueryResult.rows
        });
    });
});

router.get('/search/categories', (req, res) => {
    let categoriesFromRequest = req.query['categories-checkboxes'];
    let categoriesFromRequestAsArray;
    // Check if there is more than one value passed by form
    if (!Array.isArray(categoriesFromRequest)) {
        // If there isn't, push existing values to empty array
        categoriesFromRequestAsArray = [];
        categoriesFromRequestAsArray.push(categoriesFromRequest);
    } else {
        // If there is, copy values to new array
        categoriesFromRequestAsArray = categoriesFromRequest;
    }

    // Determine how many parameters are needed in PG Query - for each create $i string
    let queryParametersList = [];
    for (let i = 1; i <= categoriesFromRequestAsArray.length; i++) {
        queryParametersList.push('$' + i);
    }

    // Generate query string with $i's
    const searchCategoriesQueryString = `
    SELECT DISTINCT ON (rec.recipe_name) recipe_name, 
        rec.id_recipe, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation, 
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
        usr.nickname, 
        cpr.category_id, 
        cat.category_name 
    FROM recipes rec 
        INNER JOIN categories_per_recipe cpr ON cpr.recipe_id = rec.id_recipe
        INNER JOIN categories cat ON cpr.category_id = cat.id_category
        INNER JOIN users usr ON rec.user_id = usr.id_user     
    WHERE cat.category_name IN  (${queryParametersList.join(',')})`;

    // Query PostgreSQL - ops have to be an array (even if there is only one value within)
    pgClient.query(searchCategoriesQueryString, categoriesFromRequestAsArray, (searchCategoriesQueryError, searchCategoriesQueryResult) => {
        if (searchCategoriesQueryError) throw searchCategoriesQueryError;
        res.render('./recipes/recipe_search_categories', { 
            searchedCategories: categoriesFromRequestAsArray,
            recipes: searchCategoriesQueryResult.rows
        });
    });
});

module.exports = router;