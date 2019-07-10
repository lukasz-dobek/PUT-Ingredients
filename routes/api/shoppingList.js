const express = require('express');
const pgClient = require('../../db/pg-controller');
const router = express.Router();

router.post('/', (req, res) => {
    const addToShoppingListQueryString = `
    INSERT INTO shop_lists (user_id, recipe_id) VALUES
    ($1, $2);
    `;
    // to_timestamp(${Date.now() / 1000.0})
    const userId = req.body.userId;
    const recipeId = req.body.recipeId;

    pgClient.query(addToShoppingListQueryString, [userId, recipeId], (addToShoppingListQueryError, addToShoppingListQueryResult) => {
        if (addToShoppingListQueryError) {
            throw addToShoppingListQueryError;
        }
        console.log(`POST /shoppingList - query successful - ${addToShoppingListQueryResult.rowCount} added`);
        res.json(addToShoppingListQueryResult.rows);
    });
});


router.delete('/', (req, res) => {
    const removeFromShoppingListQueryString = `
    DELETE FROM shop_lists
    WHERE user_id = $1 AND recipe_id = $2;
    `
    const userId = req.body.userId;
    const recipeId = req.body.recipeId;
    pgClient.query(removeFromShoppingListQueryString, [userId, recipeId], (removeFromShoppingListQueryError, removeFromShoppingListQueryResult) => {
        if (removeFromShoppingListQueryError) {
            throw removeFromShoppingListQueryError;
        }
        console.log(`DELETE /favourites - query successful - ${removeFromShoppingListQueryResult.rowCount} removed`);
        res.json(removeFromShoppingListQueryResult.rows);
    });
});

module.exports = router;