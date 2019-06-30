const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/all', (req, res) => {
    const allCategoriesQueryString = "SELECT * FROM categories;";
    pgClient.query(allCategoriesQueryString, (allCategoriesQueryError, allCategoriesQueryResult) => {
        if(allCategoriesQueryError) {
            throw allCategoriesQueryError;
        }
        res.json(allCategoriesQueryResult.rows);
    });
});

router.get('/recipe/:id', (req, res) => {
    const catPerRecipeQueryString = `
    SELECT 
        rec.recipe_name,
        cpr.recipe_id,
        cat.category_name
    FROM recipes rec 
        INNER JOIN categories_per_recipe cpr ON rec.id_recipe = cpr.recipe_id
        INNER JOIN categories cat ON cat.id_category = cpr.category_id
    WHERE rec.id_recipe = $1;`;

    const idRecipe = parseInt(req.params.id);

    pgClient.query(catPerRecipeQueryString, [idRecipe], (catPerRecipeQueryError, catPerRecipeQueryResult) => {
        if (catPerRecipeQueryError) throw catPerRecipeQueryError;
        res.json(catPerRecipeQueryResult.rows);
    });
});

module.exports = router;