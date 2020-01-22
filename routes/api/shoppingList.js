const express = require('express');
const pgClient = require('../../db/PGController');
const router = express.Router();

router.post('/', (req, res) => {
    const addToShoppingListQueryString = `
    INSERT INTO shop_lists (user_id, recipe_id) VALUES
    ($1, $2);
    `;
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

router.get('/recipe/:recipe', (req, res) => {
    const queryString = `SELECT isl.ingredient_id, i.ingredient_name,t.name,isl.amount,u.unit_name,u.id_unit from ingredients i
    JOIN types t ON t.id_type=i.type_id
    JOIN ingredients_used_in_shop_list isl ON isl.ingredient_id=i.id_ingredient
    JOIN units u ON u.id_unit=isl.unit_id
    JOIN shop_lists sl ON sl.id_shop_list=isl.shop_list_id
    JOIN recipes r ON r.id_recipe=sl.recipe_id
    WHERE r.recipe_name like $1; `
    const recipeName = req.params.recipe;
    pgClient.query(queryString, [recipeName], (err, result) => {
        if (err) throw err;

        res.json(result.rows);
    });
});

router.post('/update', (req, res) => {
    const removeFromShoppingListQueryString = `
UPDATE ingredients_used_in_shop_list isl SET unit_id = $1, amount = $2 WHERE isl.ingredient_id = $3 AND isl.shop_list_id = (SELECT id_shop_list
    FROM shop_lists sl INNER JOIN recipes r ON sl.recipe_id = r.id_recipe INNER JOIN users u ON u.id_user=sl.user_id WHERE r.recipe_name = $4 AND u.email_address = $5)
    `;
    const unit_id = req.body.unit_id;
    const amount = req.body.quantity;
    const ingredientId = req.body.ingredient_id;
    const recipe_name = req.body.recipe_name;
    const email_address = req.body.email_address;
    pgClient.query(removeFromShoppingListQueryString, [unit_id, amount, ingredientId, recipe_name, email_address], (removeFromShoppingListQueryError, removeFromShoppingListQueryResult) => {
        if (removeFromShoppingListQueryError) {
            throw removeFromShoppingListQueryError;
        }
        console.log(`DELETE /ingredient - query successful - ${removeFromShoppingListQueryResult.rowCount} removed`);
        res.json(removeFromShoppingListQueryResult.rows);
    });
});

router.delete('/ingredient', (req, res) => {
    const removeFromShoppingListQueryString = `
        DELETE FROM ingredients_used_in_shop_list isl WHERE isl.ingredient_id = $1 AND isl.shop_list_id = (SELECT id_shop_list
        FROM shop_lists sl INNER JOIN recipes r ON sl.recipe_id = r.id_recipe 
            INNER JOIN users u ON u.id_user=sl.user_id 
        WHERE r.recipe_name = $2
        AND u.email_address = $3 )
    `
    const ingredientId = req.body.ingredient_id;
    const recipe_name = req.body.recipe_name;
    const email_address = req.body.email_address;
    pgClient.query(removeFromShoppingListQueryString, [ingredientId, recipe_name, email_address], (removeFromShoppingListQueryError, removeFromShoppingListQueryResult) => {
        if (removeFromShoppingListQueryError) {
            throw removeFromShoppingListQueryError;
        }
        console.log(`DELETE /ingredient - query successful - ${removeFromShoppingListQueryResult.rowCount} removed`);
        res.json(removeFromShoppingListQueryResult.rows);
    });
});

router.delete('/shoppingList', async (req, res) => {

    const queryString = `
    DELETE FROM ingredients_used_in_shop_list 
        WHERE shop_list_id = 
            (SELECT id_shop_list
            FROM shop_lists sl INNER JOIN recipes r ON sl.recipe_id = r.id_recipe 
            WHERE r.recipe_name = $1)`;

    const removeFromShoppingListQueryString = `
    DELETE FROM shop_lists
    WHERE user_id = 
        (SELECT id_user FROM users WHERE email_address =$1) 
    AND recipe_id = 
        (SELECT id_recipe FROM recipes WHERE recipe_name = $2);`;

    const email_address = req.body.email_address;
    const recipeName = req.body.recipe_name;

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN");
        await client.query(queryString, [recipeName]);
        const result = await client.query(removeFromShoppingListQueryString, [email_address, recipeName]);
        await client.query("COMMIT");
        res.json(result.rows);
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
            return next(er);
        });
        console.log(e);
        return next(e);
        } finally {
        client.release();
    }
});

module.exports = router;