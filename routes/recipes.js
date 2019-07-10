const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const latinize = require('latinize');
const multer = require('multer');

const { ensureAuthenticated } = require('../config/auth');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' +  file.originalname.replace(' ', '_'));
    }
});

let upload = multer({ storage : storage });

function createLinkToRecipe(recipeName) {
    return '/recipes/'.concat(latinize(recipeName.replace(' ', '_')));
}

router.get('/', ensureAuthenticated, (req, res) => {
    const lastNineRecipesQueryString = "SELECT * FROM recipes WHERE state ='Zweryfikowany' ORDER BY date_of_creation DESC LIMIT 9 ";
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

router.post('/add_new_recipe', upload.array('imageInput', 4), (req, res) => {
    let filepathsArray = [];
    // Modify filepaths so they match database format
    for (let file of req.files) {
        filepathsArray.push('/' + file.path.substring(7).replace('\\', '/'));
    }

    // Fill array with nulls
    for (let i = filepathsArray.length; i < 4; i++){
        filepathsArray.push(null);
    }

    const addRecipeQueryString = `
    INSERT INTO recipes (
        user_id,
        recipe_name, 
        state, 
        score, 
        date_of_creation, 
        date_of_modification,
        complicity, 
        preparation_time,
        description,
        number_of_people,
        link_to_recipe,
        photo_one,
        photo_two,
        photo_three,
        photo_four,
        visible_email
    ) VALUES ($1, $2, $3, $4, TO_TIMESTAMP($5 / 1000.0), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16);`;

    let ingredientsNumber = req.body.ingredientName.length;

    let addIngredientsQueryString = `
    INSERT INTO ingredients_used_in_recipe (recipe_id, ingredient_id, unit_id, amount) VALUES
        ($1, (SELECT id_ingredient FROM ingredients WHERE ingredient_name = $2), (SELECT id_unit FROM units WHERE unit_name = $3), $4)`;

    let selectRecipeIdQueryString = `SELECT id_recipe FROM recipes WHERE recipe_name = $1`;

    let queryParametersList = [];
    for (let i = 1; i <= ingredientsNumber; i++) {
        queryParametersList.push('$' + (i * i));
        queryParametersList.push('$' + (i * i) + 1);
        queryParametersList.push('$' + (i * i) + 2);
        queryParametersList.push('$' + (i * i) + 3);
    }

    // for (let i = 0; i < ingredientsNumber; i++){
    //     addIngredientsQueryString+=' ($1, SELECT id_ingredient FROM ingredients WHERE ingredient_name = $2), (SELECT id_unit FROM units WHERE unit_name = $3), $4),';
    // }
    // addIngredientsQueryString = addIngredientsQueryString.slice(0,-1);
    // to_timestamp(${Date.now() / 1000.0})
    const recipeBody = {
        user_id: res.locals.userId,
        recipe_name: req.body.recipeName,
        state: 'Oczekuje akceptacji',
        score: 0.0,
        date_of_creation: Date.now(),
        date_of_modification: null,
        complicity: req.body.complicity,
        preparation_time: req.body.preparationTime,
        description: req.body.description,
        number_of_people: req.body.numberOfPeople,
        link_to_recipe: createLinkToRecipe(req.body.recipeName),
        photo_one: filepathsArray[0],
        photo_two: filepathsArray[1],
        photo_three: filepathsArray[2],
        photo_four: filepathsArray[3],
        visible_email: req.body.emailAccepted ? "true" : "false"
    };
    pgClient.query(addRecipeQueryString, [
        recipeBody.user_id,
        recipeBody.recipe_name,
        recipeBody.state,
        recipeBody.score,
        recipeBody.date_of_creation,
        recipeBody.date_of_modification,
        recipeBody.complicity,
        recipeBody.preparation_time,
        recipeBody.description,
        recipeBody.number_of_people,
        recipeBody.link_to_recipe,
        recipeBody.photo_one,
        recipeBody.photo_two,
        recipeBody.photo_three,
        recipeBody.photo_four,
        recipeBody.visible_email
    ], (addRecipeQueryError, addRecipeQueryResult) => {
        if (addRecipeQueryError) {
            throw addRecipeQueryError;
        }
        pgClient.query(selectRecipeIdQueryString, [recipeBody.recipe_name], (selectRecipeIdQueryError, selectRecipeIdQueryResult) => {
            if (selectRecipeIdQueryError) {
                throw selectRecipeIdQueryError;
            }
            for (let i = 0; i < ingredientsNumber; i++) {
                pgClient.query(addIngredientsQueryString, [selectRecipeIdQueryResult.rows[0]["id_recipe"], req.body.ingredientName[i], req.body.ingredientUnit[i], req.body.ingredientQuantity[i]],
                    (addIngredientsQueryError, addIngredientsQueryResult) => {
                        if (addIngredientsQueryError) {
                            throw addIngredientsQueryError;
                        }
                        console.log(addIngredientsQueryResult.command, addIngredientsQueryResult.rowCount);
                    });
            }
        })
        res.redirect('/recipes/add_recipe_confirmation');
    });
});

router.get('/add_recipe_confirmation', (req, res) => {
    res.render('./recipes/add_recipe_confirmation');
});

router.get('/ingredients', (req, res) => {
    res.render('./recipes/ingredients_search_screen');
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
        rec.visible_email,
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

    const alternativeIngredientsQueryString = `
    SELECT 
    ing.ingredient_name,
    string_agg(ing_a.ingredient_name, ', ') AS alternative_ingredients
    FROM ingredients_used_in_recipe iur 
        INNER JOIN ingredients ing ON iur.ingredient_id = ing.id_ingredient 
        INNER JOIN units unt ON iur.unit_id = unt.id_unit
        INNER JOIN alternative_ingredients ai ON ing.id_ingredient = ai.ingredient_id
        INNER JOIN ingredients ing_a ON ai.replacement_id = ing_a.id_ingredient
    WHERE iur.recipe_id = $1
    GROUP BY ing.ingredient_name;
    `;

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
            pgClient.query(alternativeIngredientsQueryString, [recipeId], (alternativeIngredientsQueryError, alternativeIngredientsQueryResult) => {
                if (alternativeIngredientsQueryError) {
                    throw alternativeIngredientsQueryError;
                }
                res.render('./recipes/recipe_page', {
                    recipe: recipeQueryResult.rows,
                    ingredients: ingredientsQueryResult.rows,
                    alternative_ingredients: alternativeIngredientsQueryResult.rows
                });
            });

        });
    });
});

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
    WHERE LOWER(recipe_name) LIKE $1 AND rec.state = 'Zweryfikowany';`;

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
    WHERE cat.category_name IN  (${queryParametersList.join(',')}) AND rec.state = 'Zweryfikowany';`;

    // Query PostgreSQL - ops have to be an array (even if there is only one value within)
    pgClient.query(searchCategoriesQueryString, categoriesFromRequestAsArray, (searchCategoriesQueryError, searchCategoriesQueryResult) => {
        if (searchCategoriesQueryError) throw searchCategoriesQueryError;
        res.render('./recipes/recipe_search_categories', {
            searchedCategories: categoriesFromRequestAsArray,
            recipes: searchCategoriesQueryResult.rows
        });
    });
});

router.post('/search/ingredients', (req, res) => {
    let ingredientsFromRequest = req.body['ingredientCheck'];
    let ingredientsFromRequestAsArray;
    // Check if there is more than one value passed by form
    if (!Array.isArray(ingredientsFromRequest)) {
        // If there isn't, push existing values to empty array
        ingredientsFromRequestAsArray = [];
        ingredientsFromRequestAsArray.push(ingredientsFromRequest);
    } else {
        // If there is, copy values to new array
        ingredientsFromRequestAsArray = ingredientsFromRequest;
    }

    // Determine how many parameters are needed in PG Query - for each create $i string
    let queryParametersList = [];
    for (let i = 1; i <= ingredientsFromRequestAsArray.length; i++) {
        queryParametersList.push('$' + i);
    }

    // Generate query string with $i's
    const searchIngredientsQueryString = `
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
        usr.nickname
    FROM recipes rec 
        INNER JOIN ingredients_used_in_recipe iuir ON rec.id_recipe = iuir.recipe_id
        INNER JOIN ingredients ing ON iuir.ingredient_id = ing.id_ingredient
        INNER JOIN users usr ON rec.user_id = usr.id_user     
    WHERE ing.ingredient_name IN (${queryParametersList.join(',')}) AND rec.state = 'Zweryfikowany';`;

    // Query PostgreSQL - ops have to be an array (even if there is only one value within)
    pgClient.query(searchIngredientsQueryString, ingredientsFromRequestAsArray, (searchIngredientsQueryError, searchIngredientsQueryResult) => {
        if (searchIngredientsQueryError) throw searchIngredientsQueryError;
        res.render('./recipes/recipe_search_ingredients', {
            searchedIngredients: ingredientsFromRequestAsArray,
            recipes: searchIngredientsQueryResult.rows
        });
    });
});

module.exports = router;