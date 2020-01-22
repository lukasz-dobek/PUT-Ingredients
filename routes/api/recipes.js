const express = require('express');
const pgClient = require('../../db/PGController');
const router = express.Router();

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
    const value = req.params.name;

    pgClient.query(queryString, ['%' + value + '%'], (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

router.delete('/:id', (req, res) => {
    const removeFromRecipesQueryString = `
    DELETE FROM recipes 
    WHERE id_recipe = $1;
    `;
    const recipeId = req.params.id;
    pgClient.query(removeFromRecipesQueryString, [recipeId], (removeFromRecipesQueryError, removeFromRecipesQueryResult) => {
        if (removeFromRecipesQueryError) {
            throw removeFromRecipesQueryError;
        }
        console.log(`DELETE /recipes - query successful - ${removeFromRecipesQueryResult.rowCount} removed`);
        res.json(removeFromRecipesQueryResult.rows);
    });
});

router.post('/accept_recipe', (req, res) => {
    const acceptRecipeQueryString = `UPDATE recipes SET state = 'Zweryfikowany', date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE id_recipe = $1`;
    const recipeId = req.body.recipeId;

    pgClient.query(acceptRecipeQueryString, [recipeId], (acceptRecipeQueryError, acceptRecipeQueryResult) => {
        if (acceptRecipeQueryError) {
            acceptRecipeQueryError;
        }
        res.json(acceptRecipeQueryResult.rows);
    });
});

router.post('/reject_recipe', (req, res) => {
    const rejectRecipeQueryString = `UPDATE recipes SET state = 'Niezaakceptowany', date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE id_recipe = $1`;
    const recipeId = req.body.recipeId;
    pgClient.query(rejectRecipeQueryString, [recipeId], (rejectRecipeQueryError, rejectRecipeQueryResult) => {
        if (rejectRecipeQueryError) {
            rejectRecipeQueryError;
        }
        res.json(rejectRecipeQueryResult.rows);
    });
});

router.get('/transactions_test', (req, res) => {
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

module.exports = router;