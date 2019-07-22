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
        res.redirect('/users/shopping_lists');
        //res.json(addToShoppingListQueryResult.rows);
    });
});

router.get('/recipe/:recipe',(req,res)=>{
   const queryString = `SELECT isl.ingredient_id, i.ingredient_name,t.name,isl.amount,u.unit_name from ingredients i
    JOIN types t ON t.id_type=i.type_id
    JOIN ingredients_used_in_shop_list isl ON isl.ingredient_id=i.id_ingredient
    JOIN units u ON u.id_unit=isl.unit_id
    JOIN shop_lists sl ON sl.id_shop_list=isl.shop_list_id
    JOIN recipes r ON r.id_recipe=sl.recipe_id
    WHERE r.recipe_name like $1; `
    const recipeName = req.params.recipe;
   console.log(recipeName);
   pgClient.query(queryString,[recipeName],(err,result)=>{
       if(err) throw err;

       res.json(result.rows);
   });
});


router.delete('/ingredient', (req, res) => {
    const removeFromShoppingListQueryString = `
    DELETE FROM ingredients_used_in_shop_list
    WHERE ingredient_id = $1;
    `
    const ingredientId = req.body.ingredient_id;
    console.log(ingredientId);
    pgClient.query(removeFromShoppingListQueryString, [ingredientId], (removeFromShoppingListQueryError, removeFromShoppingListQueryResult) => {
        if (removeFromShoppingListQueryError) {
            throw removeFromShoppingListQueryError;
        }
        console.log(`DELETE /ingredient - query successful - ${removeFromShoppingListQueryResult.rowCount} removed`);
        res.json(removeFromShoppingListQueryResult.rows);
    });
});

router.delete('/shoppingList', (req, res) => {

    const queryString = `DELETE FROM ingredients_used_in_shop_list WHERE shop_list_id = (SELECT id_shop_list
    FROM shop_lists sl INNER JOIN recipes r ON sl.recipe_id = r.id_recipe WHERE r.recipe_name = $1)`;
    const removeFromShoppingListQueryString = `
    DELETE FROM shop_lists
    WHERE  user_id = (SELECT id_user FROM users WHERE email_address =$1) and recipe_id = (SELECT id_recipe FROM recipes WHERE recipe_name = $2);
    `
    const email_address = req.body.email_address;
    const recipeName = req.body.recipe_name;
    console.log(recipeName);
    pgClient.query(queryString, [recipeName], (removeFromShoppingListQueryError, removeFromShoppingListQueryResult) => {
        if (removeFromShoppingListQueryError) {
            throw removeFromShoppingListQueryError;
        }
        pgClient.query(removeFromShoppingListQueryString,[email_address,recipeName],(err,result)=>{
           if (err) {throw err;}
            console.log(`DELETE /shoppingList - query successful - ${removeFromShoppingListQueryResult.rowCount} removed`);
            res.json(result.rows);
        });
    });
});


module.exports = router;