const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('../db/PGController');

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
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,
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
    WHERE usr.nickname LIKE $1 AND rec.state LIKE $2;`;

    const userNickname = req.params.user;
    let state = req.params.user === res.locals.userNickname ? '%' : 'Zweryfikowany';
    pgClient.query(searchUserRecipesQueryString, [userNickname, state], (searchUserRecipesQueryError, searchUserRecipesQueryResult) => {
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
        CASE rec.complicity
            WHEN 1 THEN 'Łatwe'
            WHEN 2 THEN 'Średnie'
            WHEN 3 THEN 'Trudne'
        END AS complicity,        
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
        res.render('./users/favourites', { recipes: userFavouritesQueryResult.rows });
    });
});

router.post('/change_password', async (req, res) => {
    const { email, oldPassword, newPassword, passwordConfirm } = req.body;

    if (newPassword !== passwordConfirm) {
        req.flash('error_msg', 'Podane hasła się nie zgadzają.');
        res.redirect('/users/settings');
    } else {
        const veryfiOldPasswordQueryString =
            `SELECT password FROM users WHERE email_address = $1;`;

        const updateQueryString =
            `UPDATE users SET password = $1 WHERE email_address = $2;`;

        const client = await pgClient.connect();
        try {
            await client.query("BEGIN");
            const verify = await client.query(veryfiOldPasswordQueryString, [email]);
            argon2.verify(verify.rows[0].password, oldPassword).then(isAuthorised => {
                if (isAuthorised) {
                    argon2.hash(newPassword).then(async hash => {
                        await client.query(updateQueryString, [hash, email]);
                        req.flash('success_msg', 'Hasło zmienione poprawnie.');
                        res.redirect('/users/settings');
                    }).catch(hashErr => {
                        throw hashErr;
                    });
                } else {
                    console.log('Not authorised...');
                    req.flash('error_msg', 'Podano niepoprawne stare hasło.');
                    res.redirect('/users/settings');
                }
            }).catch(verifyErr => {
                throw verifyErr;
            });
            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK").catch(er => {
                console.log(er);
            });
            return e;
        } finally {
            client.release();
        }
    }
});

router.post('/change_names', (req, res) => {
    const { name, surname } = req.body;

    const updateUserInfoQueryString =
        `UPDATE users SET name = $1, surname = $2 WHERE email_address = $3;`;

    pgClient.query(updateUserInfoQueryString, [name, surname, res.locals.userEmail], (updateUserInfoQueryError, updateUserInfoQueryResult) => {
        if (updateUserInfoQueryError) {
            throw updateUserInfoQueryString;
        }
        console.log(`Updated ${updateUserInfoQueryResult.rowCount} row`);
        req.flash('success_msg', 'Poprawnie zmieniono imię i/lub nazwisko.');
        res.redirect('/users/settings');
    });
});

router.get('/delete_account', async (req, res) => {
    const swapRecipeAuthorsQueryString =
        `UPDATE recipes SET user_id = 1 WHERE user_id = $1`;

    const userDeleteQueryString =
        `UPDATE users SET state=3, date_of_deletion = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE email_address = $1;`;

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN");
        await client.query(swapRecipeAuthorsQueryString, [res.locals.userID]);
        await client.query(userDeleteQueryString, [res.locals.userEmail]);
        await client.query("COMMIT");
        res.redirect("/logout");
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.post('/report_recipe', async (req, res) => {

    let reportedRecipeUrl = req.get('Referer').match(/\/recipes\/[a-z_0-9]+/)[0];
    const getRecipeInfoQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.user_id 
    FROM recipes rec  
    WHERE rec.link_to_recipe = $1;`;

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

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN");
        const recipe = await client.query(getRecipeInfoQueryString, [reportedRecipeUrl]);

        let reporteeId = res.locals.userId;
        let reportedId = recipe.rows[0]["user_id"];
        let reportedRecipeId = recipe.rows[0]["id_recipe"];
        let assignedAdmin = 1;
        let reportDescription = req.body["reportRecipeDescription"];
        let status = 0;

        if (reporteeId === reportedId) {
            req.flash('error_msg', 'Nie można zgłosić swojego przepisu!');
            res.redirect(reportedRecipeUrl);
        } else {
            await client.query(reportQueryString, [reporteeId, reportedId, assignedAdmin, reportedRecipeId, reportDescription, status, Date.now()]);
            await client.query("COMMIT");
            req.flash('success_msg', 'Zgłoszenie zostało wysłane poprawnie.');
            res.redirect(reportedRecipeUrl);
        }
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/shopping_lists', (req, res) => {
    res.render('./users/shopping_lists');
});

module.exports = router;
