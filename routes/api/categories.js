const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/all', (req, res) => {
    pgClient.query('SELECT * FROM categories', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/categories_per_recipe/:id', (req, res) => {
    // const queryString = `select c.category_name from categories c
    //     inner join categories_per_recipe cpr on cpr.category_id =c.id_category
    //     inner join recipes r on r.id_recipe = cpr.recipe_id where r.id_recipe = $1;`;
    
    const queryString = `select r.recipe_name, cpr.recipe_id, c.category_name
    from recipes r join categories_per_recipe cpr on r.id_recipe = cpr.recipe_id join categories c on c.id_category = cpr.category_id
    where r.id_recipe = $1;`

    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value ,(err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });

});

module.exports = router;