const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');

router.get('/', (req, res) => {
    pgClient.query('SELECT * FROM recipes', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/:id', (req, res) => {
    const queryString = 'SELECT * FROM recipes WHERE id_recipe = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) =>{
        if (err) throw err;
        res.json(result.rows);
    });
});


module.exports = router;