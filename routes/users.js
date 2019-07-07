const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');
const { ensureLoggedIn } = require('../config/auth');

router.get('/settings', (req, res) => {
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
        if (searchUserRecipesQueryError) {
            throw searchUserRecipesQueryError;
        }
        res.render('./users/user_recipes', { recipes: searchUserRecipesQueryResult.rows });
    });
});

router.get('/favourites', (req, res) => {
    const userFavouritesQueryString = `
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
        usr_a.email_address,
        usr_a.nickname
    FROM favourites fav 
        INNER JOIN recipes rec ON fav.recipe_id = rec.id_recipe
		INNER JOIN users usr_a ON usr_a.id_user = rec.user_id 
		INNER JOIN users usr_b ON usr_b.id_user = fav.user_id
    WHERE usr_b.email_address = $1;`;

    const userEmail = res.locals.userEmail;

    pgClient.query(userFavouritesQueryString, [userEmail], (userFavouritesQueryError, userFavouritesQueryResult) => {
        if (userFavouritesQueryError) {
            throw userFavouritesQueryError;
        }
        console.log(userFavouritesQueryResult.rows);
        res.render('./users/favourites', { recipes: userFavouritesQueryResult.rows });
    });
});

router.post('/change_password', (req, res) => {
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const passwordConfirm = req.body.passwordConfirm;

    const veryfiOldPasswordQueryString = `
    SELECT password FROM users WHERE email_address = $1;
    `;

    const updateQueryString = `
    UPDATE users SET password = $1 WHERE email_address = $2;
    `;

    pgClient.query(veryfiOldPasswordQueryString, [email], (veryfiOldPasswordQueryError, veryfiOldPasswordQueryResult) => {
        if (veryfiOldPasswordQueryError) {
            throw veryfiOldPasswordQueryError;
        }
        console.log('Veryfying...');
        argon2.verify(veryfiOldPasswordQueryResult.rows[0].password, oldPassword).then((isAuthorised) => {
            if (isAuthorised) {
                try {
                    console.log('Authorised...');
                    argon2.hash(newPassword).then(hash => {
                        pgClient.query(updateQueryString, [hash, email], (updateQueryError, updateQueryResult) => {
                            console.log('Updating...');
                            if (updateQueryError) {
                                throw updateQueryError;
                            };
                            req.flash('success_msg', 'Hasło zmienione poprawnie.');
                            res.redirect('/users/settings');
                        });
                    });
                } catch (err) {
                    throw err;
                }
            } else {
                console.log('Not authorised...');
                req.flash('error_msg', 'Podano niepoprawne stare hasło.');
                res.redirect('/users/settings');
            }
        });
    });
});

router.get('/shopping_lists', (req, res) => {
    res.render('./users/shopping_lists');
});

module.exports = router;
