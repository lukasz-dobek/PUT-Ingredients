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

router.get('/recipe/:id', (req, res) => {
    const ingredientsPerRecipeIdQueryString = `
    SELECT 
        ingr.ingredient_name,
        unt.unit_name,
        iuir.amount
    FROM ingredients_used_in_recipe iuir
        INNER JOIN ingredients ingr ON iuir.ingredient_id = ingr.id_ingredient
        INNER JOIN recipes rec ON iuir.recipe_id = rec.id_recipe
        INNER JOIN units unt ON iuir.unit_id = unt.id_unit
    WHERE rec.id_recipe = $1`

    let recipeId = req.params.id;
    pgClient.query(ingredientsPerRecipeIdQueryString, [recipeId], (ingredientsPerRecipeIdQueryError, ingredientsPerRecipeIdQueryResult) => {
        if (ingredientsPerRecipeIdQueryError) {
            throw ingredientsPerRecipeIdQueryError;
        }
        res.json(ingredientsPerRecipeIdQueryResult.rows);
    });
});

module.exports = router;