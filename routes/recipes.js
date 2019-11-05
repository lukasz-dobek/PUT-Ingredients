const express = require('express');
const router = express.Router();
const pgClient = require('../db/PGController');
const latinize = require('latinize');
const multer = require('multer');

const { ensureAuthenticated } = require('../config/auth');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname.replace(' ', '_'));
    }
});

let upload = multer({ storage: storage });

const createLinkToRecipe = recipeName => {
    return '/recipes/'.concat(latinize(recipeName.replace(/ /g, '_').toLowerCase()));
}

router.get('/', ensureAuthenticated, (req, res) => {
    const lastNineRecipesQS = `
    SELECT 
        link_to_recipe,
        photo_one,
        recipe_name 
    FROM recipes
    WHERE state = 'Zweryfikowany'
    ORDER BY date_of_creation DESC 
    LIMIT 9;`;

    pgClient.query(lastNineRecipesQS, (lastNineRecipesQE, lastNineRecipesQR) => {
        if (lastNineRecipesQE) throw lastNineRecipesQE;
        res.render('./recipes/front_page', {
            recipes: lastNineRecipesQR.rows
        });
    });
});

router.get('/add_new_recipe', (req, res) => {
    res.render('./recipes/add_new_recipe');
});

router.post('/add_new_recipe', upload.array('imageInput', 4), async (req, res) => {
    let filepathsArray = [];
    // Modify filepaths so they match database format
    for (let file of req.files) {
        filepathsArray.push('/' + file.path.substring(7).replace('\\', '/'));
    }

    [filepathsArray[0], filepathsArray[req.body.mainPhotoSelect]] = [filepathsArray[req.body.mainPhotoSelect], filepathsArray[0]];

    // Fill array with nulls
    for (let i = filepathsArray.length; i < 4; i++) {
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
    ) VALUES ($1, $2, $3, $4, TO_TIMESTAMP($5 / 1000.0), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_recipe;`;

    let ingredientsNumber = req.body.ingredientName.length;

    let addIngredientsQueryString = `
    INSERT INTO ingredients_used_in_recipe (recipe_id, ingredient_id, unit_id, amount) VALUES
        ($1, (SELECT id_ingredient FROM ingredients WHERE ingredient_name = $2), (SELECT id_unit FROM units WHERE unit_name = $3), $4)`;

    let insertCategoriesQueryString = `
    INSERT INTO categories_per_recipe (recipe_id, category_id) VALUES 
    ($1, (SELECT id_category FROM categories WHERE category_name = $2));`;

    let queryParametersList = [];
    for (let i = 1; i <= ingredientsNumber; i++) {
        queryParametersList.push('$' + (i * i));
        queryParametersList.push('$' + (i * i) + 1);
        queryParametersList.push('$' + (i * i) + 2);
        queryParametersList.push('$' + (i * i) + 3);
    }

    let isCategoryAnArray = Array.isArray(req.body.category);
    let categoriesNumber = isCategoryAnArray ? req.body.category.length : 1;

    const recipeBody = [
        res.locals.userId,  //     user_id  
        req.body.recipeName,    //     recipe_name
        'Niezweryfikowany', //     state
        0.0,    //     score
        Date.now(), //     date_of_creation
        null,   //     date_of_modification
        req.body.complicity,    //     complicity
        req.body.preparationTime,   //     preparation_time
        req.body.description,   //     description
        req.body.numberOfPeople,    //     number_of_people
        createLinkToRecipe(req.body.recipeName),    //     link_to_recipe
        filepathsArray[0],  //     photo_one
        filepathsArray[1],  //     photo_two
        filepathsArray[2],  //     photo_three
        filepathsArray[3],  //     photo_four
        req.body.emailAccepted ? "true" : "false"   //     visible_email
    ];

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN;");
        const query = await client.query(addRecipeQueryString, recipeBody);
        for (let i = 0; i < ingredientsNumber; i++) {
            await client.query(addIngredientsQueryString, [query.rows[0]["id_recipe"], req.body.ingredientName[i], req.body.ingredientUnit[i], req.body.ingredientQuantity[i]]);
        }
        for (let j = 0; j < categoriesNumber; j++) {
            await client.query(insertCategoriesQueryString, [query.rows[0]["id_recipe"], isCategoryAnArray ? req.body.category[j] : req.body.category]);
        }
        await client.query("COMMIT;");
        res.redirect('/recipes/add_recipe_confirmation');
    } catch (e) {
        await client.query('ROLLBACK').catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/add_recipe_confirmation', (req, res) => {
    res.render('./recipes/add_recipe_confirmation');
});

router.get('/edit_recipe_confirmation', (req, res) => {
    res.render('./recipes/edit_recipe_confirmation');
});

router.get('/ingredients', (req, res) => {
    res.render('./recipes/ingredients_search_screen');
});

router.get('/:linkToRecipe', async (req, res, next) => {
    const recipeQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation, 
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,
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

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN;");
        const recipe = await client.query(recipeQueryString, [linkToRecipe]);
        if (recipe.rowCount === 0) {
            res.status(404).render('error', { message: 'Przepis nie istnieje.' });
        } else {
            const recipeId = recipe.rows[0]["id_recipe"];
            const ingredients = await client.query(ingredientsQueryString, [recipeId]);
            const alternativeIngredients = await client.query(alternativeIngredientsQueryString, [recipeId]);
            res.render('./recipes/recipe_page', {
                recipe: recipe.rows,
                ingredients: ingredients.rows,
                alternative_ingredients: alternativeIngredients.rows
            });
        }
        await client.query("COMMIT;");
    } catch (e) {
        await client.query("ROLLBACK;").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/:linkToRecipe/edit', (req, res) => {
    const searchNameQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.photo_one,
        rec.photo_two,
        rec.photo_three,
        rec.photo_four,
        rec.complicity,
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity_name,        
        rec.preparation_time, 
        rec.description, 
        rec.number_of_people, 
        rec.link_to_recipe,
        rec.visible_email
    FROM recipes rec WHERE rec.link_to_recipe = $1`;

    const linkToRecipe = req.params.linkToRecipe;
    pgClient.query(searchNameQueryString, ['/recipes/' + linkToRecipe], (searchNameQueryError, searchNameQueryResult) => {
        if (searchNameQueryError) {
            throw searchNameQueryError;
        }
        res.render('./recipes/edit_recipe', {
            recipe: searchNameQueryResult.rows
        });
    });
});

router.post('/:linkToRecipe/edit', upload.array('imageInput', 4), async (req, res) => {
    let filepathsArray = [];
    // Modify filepaths so they match database format
    for (let file of req.files) {
        filepathsArray.push('/' + file.path.substring(7).replace('\\', '/'));
    }

    [filepathsArray[0], filepathsArray[req.body.mainPhotoSelect]] = [filepathsArray[req.body.mainPhotoSelect], filepathsArray[0]];

    // Fill array with nulls
    for (let i = filepathsArray.length; i < 4; i++) {
        filepathsArray.push(null);
    }
    const addRecipeQueryString = `
    UPDATE recipes SET
        state = $1,
        date_of_modification = TO_TIMESTAMP($2 / 1000.0),
        complicity = $3,
        preparation_time = $4,
        description = $5,
        number_of_people = $6,
        photo_one = COALESCE($7, photo_one),
        photo_two = COALESCE($8, photo_two),
        photo_three = COALESCE($9, photo_three),
        photo_four = COALESCE($10, photo_four),
        visible_email = $11
    WHERE id_recipe = $12;`;

    let ingredientsNumber = req.body.ingredientName.length;

    let deleteIngredientsQueryString = `DELETE FROM ingredients_used_in_recipe WHERE recipe_id = $1;`;
    let deleteCategoriesQueryString = `DELETE FROM categories_per_recipe WHERE recipe_id = $1;`;

    let addIngredientsQueryString = `
    INSERT INTO ingredients_used_in_recipe (recipe_id, ingredient_id, unit_id, amount) VALUES
        ($1, (SELECT id_ingredient FROM ingredients WHERE ingredient_name = $2), (SELECT id_unit FROM units WHERE unit_name = $3), $4)`;

    let insertCategoriesQueryString = `
    INSERT INTO categories_per_recipe (recipe_id, category_id) VALUES 
    ($1, (SELECT id_category FROM categories WHERE category_name = $2));`;

    let queryParametersList = [];
    for (let i = 1; i <= ingredientsNumber; i++) {
        queryParametersList.push('$' + (i * i));
        queryParametersList.push('$' + (i * i) + 1);
        queryParametersList.push('$' + (i * i) + 2);
        queryParametersList.push('$' + (i * i) + 3);
    }
    let isCategoryAnArray = Array.isArray(req.body.category);
    if (isCategoryAnArray) {
        req.body.category = req.body.category.filter(value => {
            return value != "";
        });
    }

    let categoriesNumber = isCategoryAnArray ? req.body.category.length : 1;

    const recipeBody = [
        'Niezweryfikowany',
        Date.now(),
        req.body.complicity,
        req.body.preparationTime,
        req.body.description,
        req.body.numberOfPeople,
        filepathsArray[0],
        filepathsArray[1],
        filepathsArray[2],
        filepathsArray[3],
        req.body.emailAccepted ? "true" : "false",
        req.body.recipeId
    ];

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN;");
        await client.query(addRecipeQueryString, recipeBody);
        await client.query(deleteCategoriesQueryString, [req.body.recipeId]);
        await client.query(deleteIngredientsQueryString, [req.body.recipeId]);
        for (let i = 0; i < ingredientsNumber; i++) {
            await client.query(addIngredientsQueryString, [req.body.recipeId, req.body.ingredientName[i], req.body.ingredientUnit[i], req.body.ingredientQuantity[i]]);
        }
        for (let j = 0; j < categoriesNumber; j++) {
            await client.query(insertCategoriesQueryString, [req.body.recipeId, isCategoryAnArray ? req.body.category[j] : req.body.category]);
        }
        await client.query("COMMIT;");
        res.redirect('/recipes/edit_recipe_confirmation');
    } catch (e) {
        await client.query("ROLLBACK;").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/search/name', (req, res) => {
    const searchNameQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation,
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,        
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

router.get('/search/categories', async (req, res) => {
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
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,        
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
        cat.category_name,
        cat.category_photo
    FROM recipes rec 
        INNER JOIN categories_per_recipe cpr ON cpr.recipe_id = rec.id_recipe
        INNER JOIN categories cat ON cpr.category_id = cat.id_category
        INNER JOIN users usr ON rec.user_id = usr.id_user     
    WHERE cat.category_name IN  (${queryParametersList.join(',')}) AND rec.state = 'Zweryfikowany';`;

    const getCategoryPhotoQueryString =
        `SELECT category_photo FROM categories WHERE category_name = $1`;

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN;");
        const recipes = await client.query(searchCategoriesQueryString, categoriesFromRequestAsArray);
        if (categoriesFromRequestAsArray.length === 1) {
            const photo = await client.query(getCategoryPhotoQueryString, categoriesFromRequestAsArray);
            res.render('./recipes/recipe_search_categories', {
                searchedCategories: categoriesFromRequestAsArray,
                recipes: recipes.rows,
                catPhoto: photo.rows[0]["category_photo"],
                oneCategory: true
            });
        } else {
            res.render('./recipes/recipe_search_categories', {
                searchedCategories: categoriesFromRequestAsArray,
                recipes: recipes.rows
            });
        }
        await client.query("COMMIT;");
    } catch (e) {
        await client.query("ROLLBACK;").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
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
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,        
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