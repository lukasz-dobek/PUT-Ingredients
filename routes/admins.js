const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');

router.get('/', (req, res) => {
    res.render('./admin_panel/main', { layout: 'layout_admin_panel'});
});

router.get('/user_management', (req, res) => {
    const userInfoQueryString = `
    SELECT 
        usr.id_user, 
        CASE usr.state
            WHEN 0 THEN 'Nieaktywny'
            WHEN 1 THEN 'Aktywny'
            WHEN 2 THEN 'Zbanowany'
            WHEN 3 THEN 'Usunięty'
        END AS state,
        usr.nickname, 
        usr.email_address, 
        MAX(usa.date_of_login) AS date_of_login
    FROM users usr INNER JOIN user_activities usa ON usr.id_user = usa.user_id
    GROUP BY usr.nickname, usr.id_user;`;
    pgClient.query(userInfoQueryString, (userInfoQueryError, userInfoQueryResult) => {
        if (userInfoQueryError) {
            throw userInfoQueryError;
        }
        res.render('./admin_panel/user_management', { layout: 'layout_admin_panel', userInfo: userInfoQueryResult.rows });
    });
});

router.get('/user_management/:nickname', (req, res) => {
    let nickname = req.params.nickname;
    const userInfoQueryString = `
    SELECT 
        email_address,
        nickname, 
        name, 
        surname, 
        date_of_join, 
        CASE is_admin
            WHEN true THEN 'tak'
            WHEN false THEN 'nie'
        END AS is_admin,
        CASE state
            WHEN 0 THEN 'Nieaktywny'
            WHEN 1 THEN 'Aktywny'
            WHEN 2 THEN 'Zbanowany'
            WHEN 3 THEN 'Usunięty'
        END AS state,
        id_user
    FROM users WHERE nickname = $1;`;

    const userActivitiesQueryString = `
    SELECT 
        date_of_activity,
        activity_name,
        link,
        details
    FROM user_activities
    WHERE nickname = $1`
    pgClient.query(userInfoQueryString, [nickname], (userInfoQueryError, userInfoQueryResult) => {
        if (userInfoQueryError) {
            throw userInfoQueryError;
        }
        pgClient.query(userActivitiesQueryString, [nickname], (userActivitiesQueryError, userActivitiesQueryResult) => {
            if (userActivitiesQueryError) {
                throw userActivitiesQueryError;
            }
            res.render('temp', { layout: 'layout_admin_panel', userInfo: userInfoQueryResult.rows, userActivities: userActivitiesQueryResult.rows });
        });
    });
});


router.get('/recipe_management', (req, res) => {
    res.render('./admin_panel/recipe_management', { layout: 'layout_admin_panel'});
});

router.get('/user_management/details', (req, res) => {
    res.render('./admin_panel/recipe_management_details', { layout: 'layout_admin_panel'});
});

module.exports = router;
