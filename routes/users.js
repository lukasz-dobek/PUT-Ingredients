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
        res.render('./users/user_recipes', { recipes: searchUserRecipesQueryResult.rows, nickname: userNickname });
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

router.post('/change_names', (req, res) => {
    let name = req.body.name;
    let surname = req.body.surname;

    const updateUserInfoQueryString = `
    UPDATE users SET name = $1, surname = $2 WHERE email_address = $3;
    `;

    pgClient.query(updateUserInfoQueryString, [name, surname, res.locals.userEmail], (updateUserInfoQueryError, updateUserInfoQueryResult) => {
        if (updateUserInfoQueryError) {
            throw updateUserInfoQueryString;
        }
        console.log(`Updated ${updateUserInfoQueryResult.rowCount} row`);
    });

    if (name && !surname) {

        res.send('Name was defined, but surname wasnt!');
    } else if (!name && surname) {
        res.send('Name wasnt defined, but surname was!');
    } else if (name && surname) {
        res.send("Both name and surname were defined!");
    } else {
        res.send('Nothing was supplied!');
    }
});

router.get('/delete_account', (req, res) => {
    const swapRecipeAuthorsQueryString = `
    UPDATE recipes SET user_id = 1 WHERE user_id = $1`;
    pgClient.query(swapRecipeAuthorsQueryString, [res.locals.userId], (swapRecipeAuthorsQueryError, swapRecipeAuthorsQueryResult) => {
        if (swapRecipeAuthorsQueryError) {
            throw swapRecipeAuthorsQueryError;
        }
        console.log(`Updated ${swapRecipeAuthorsQueryResult.rowCount} row`);
    });

    const userDeleteQueryString = `
    UPDATE users SET state=3 WHERE email_address = $1;`;
    pgClient.query(userDeleteQueryString, [res.locals.userEmail], (userDeleteQueryError, userDeleteQueryResult) => {
        if (userDeleteQueryError) {
            throw userDeleteQueryError;
        }
        console.log(`Updated ${userDeleteQueryResult.rowCount} row`);
    });
    res.redirect('/logout');
})

router.post('/report_recipe', (req, res) => {

    let reportedRecipeUrl = req.get('Referer').match(/\/recipes\/[a-z_]+/)[0];

    const getRecipeInfoQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.user_id 
    FROM recipes rec  
    WHERE rec.link_to_recipe = $1;`;

    pgClient.query(getRecipeInfoQueryString, [reportedRecipeUrl], (getRecipeInfoQueryError, getRecipeInfoQueryResult) => {
        console.log(getRecipeInfoQueryResult);
        if (getRecipeInfoQueryError) {
            throw getRecipeInfoQueryError;
        }
        let reporteeId = res.locals.userId;
        let reportedId = getRecipeInfoQueryResult.rows[0]["user_id"];
        let reportedRecipeId = getRecipeInfoQueryResult.rows[0]["id_recipe"];
        let assignedAdmin = 1;
        let reportDescription = req.body["reportRecipeDescription"];
        let status = 0;
        const reportQueryString = `
        INSERT INTO reports (
            reportee_id,
            reported_id,
            assigned_admin_id,
            recipe_id,
            description,
            status,
            date_of_report
        ) VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7 / 1000.0));`;

        console.log(reporteeId, reportedId);

        if (reporteeId === reportedId) {
            req.flash('error_msg', 'Nie można zgłosić swojego przepisu!');
            res.redirect(reportedRecipeUrl);
        } else {
            pgClient.query(reportQueryString, [reporteeId, reportedId, assignedAdmin, reportedRecipeId, reportDescription, status, Date.now()],
                (reportQueryError, reportQueryResult) => {
                    if (reportQueryError) {
                        throw reportQueryError;
                    }
                    req.flash('success_msg', 'Zgłoszenie zostało wysłane poprawnie.');
                    res.redirect(reportedRecipeUrl);
                });
        }
    });
});

router.get('/shopping_lists', (req, res) => {
    res.render('./users/shopping_lists');
});

module.exports = router;
