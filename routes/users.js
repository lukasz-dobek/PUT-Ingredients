const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');
const { ensureLoggedIn } = require('../config/auth');

router.get('/user_settings', (req, res) => {
    res.render('./users/user_settings');
});

router.get('/user_recipes/:user', (req, res) => {
    const searchUserRecipesQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        TO_CHAR(rec.date_of_creation, 'DD/MM/YYYY') AS date_of_creation, 
        rec.complicity, 
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
    WHERE usr.nickname LIKE $1;`;

    const userNickname = req.params.user;

    pgClient.query(searchUserRecipesQueryString, [userNickname], (searchUserRecipesQueryError, searchUserRecipesQueryResult) => {
        if(searchUserRecipesQueryError) {
            throw searchUserRecipesQueryError;
        }
        console.log();
        res.render('./users/user_recipes', { recipes: searchUserRecipesQueryResult.rows });
    });
});

router.get('/shopping_lists', (req, res) => {
    res.render('./users/shopping_lists');
});

module.exports = router;
