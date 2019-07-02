const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/all', (req, res) => {
    pgClient.query('SELECT * FROM users', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM users WHERE id_user = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

router.get('/shopping_list',(req, res)=>{
    const userShoppingListQueryString=`
    SELECT
        recipe_name
    FROM recipes r
        JOIN shop_lists sl ON r.id_recipe=sl.recipe_id
        JOIN users u ON u.id_user=sl.user_id
    WHERE u.id_user = $1;`

    const userId = res.locals.userId;
    pgClient.query(userShoppingListQueryString, [userId], (userShoppingListQueryError, userShoppingListQueryResult) => {
        if(userShoppingListQueryError) {
            throw userShoppingListQueryError;
        }
        console.log(userShoppingListQueryResult.rows);
        res.json(userShoppingListQueryResult.rows);
    });
});
module.exports = router;