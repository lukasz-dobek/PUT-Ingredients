const express = require('express');
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
        TO_CHAR(MAX(usa.date_of_activity), 'DD/MM/YYYY HH:MI:SS') AS date_of_activity
    FROM users usr INNER JOIN user_activities usa ON usr.id_user = usa.user_id
    GROUP BY usr.nickname, usr.id_user;`;
    pgClient.query(userInfoQueryString, (userInfoQueryError, userInfoQueryResult) => {
        if (userInfoQueryError) {
            throw userInfoQueryError;
        }
        res.render('./admin_panel/user_management', { layout: 'layout_admin_panel', userInfo: userInfoQueryResult.rows });
    });
});

router.post('/user_management', (req, res) => {
    let activeParam = req.body.active;
    let sortUsing = req.body.sortUsing;
    let sortType = req.body.sortType;
    let nameSearch = req.body.nameSearch ? req.body.nameSearch : '%';

    let orderBy;

    if (sortUsing === 'nickname') {
        orderBy = 'usr.nickname';
    } else if (sortUsing === 'ID') {
        orderBy = 'usr.id_user';
    } else if (sortUsing === 'email') {
        orderBy = 'usr.email_address';
    } else {
        orderBy = 'usa.date_of_activity';
    }

    console.log(orderBy);

    let orderPart = ` ORDER BY ${orderBy} ${sortType};`;

    let userInfoQueryString = `
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
        TO_CHAR(MAX(usa.date_of_activity), 'DD/MM/YYYY HH:MI:SS') AS date_of_activity
    FROM users usr INNER JOIN user_activities usa ON usr.id_user = usa.user_id
    WHERE usr.nickname LIKE $1 AND usr.state = $2
    GROUP BY usr.nickname, usr.id_user`;

    userInfoQueryString += orderPart;

    pgClient.query(userInfoQueryString, [nameSearch, activeParam], (userInfoQueryError, userInfoQueryResult) => {
        if (userInfoQueryError) {
            throw userInfoQueryError;
        }
        console.log(userInfoQueryResult.rows);
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
        TO_CHAR(usa.date_of_activity, 'YY/MM/DD') AS data,
        TO_CHAR(usa.date_of_activity, 'HH:MI:SS') AS godzina,
        usa.activity_name,
        usa.link,
        usa.details
    FROM user_activities usa INNER JOIN users usr ON usa.user_id = usr.id_user
    WHERE usr.nickname = $1`
    pgClient.query(userInfoQueryString, [nickname], (userInfoQueryError, userInfoQueryResult) => {
        if (userInfoQueryError) {
            throw userInfoQueryError;
        }
        pgClient.query(userActivitiesQueryString, [nickname], (userActivitiesQueryError, userActivitiesQueryResult) => {
            if (userActivitiesQueryError) {
                throw userActivitiesQueryError;
            }
            res.render('./admin_panel/user_management_details', { layout: 'layout_admin_panel', userInfo: userInfoQueryResult.rows, userActivities: userActivitiesQueryResult.rows });
        });
    });
});

router.get('/recipe_management', (req, res) => {
    const recipeQueryString = `
    SELECT
        rec.id_recipe,
        rec.state,
        rec.recipe_name,
        TO_CHAR(rec.date_of_creation, 'YY/MM/DD HH:MI:SS') as date_of_creation,
        rec.score,
        CASE (SELECT 1 FROM reports rep WHERE rep.recipe_id = rec.id_recipe) 
            WHEN 1 THEN 'TAK' 
            ELSE 'NIE' 
        END AS reported,
        usr.email_address
    FROM recipes rec INNER JOIN users usr ON rec.user_id = usr.id_user;`;
    pgClient.query(recipeQueryString, (recipeQueryError, recipeQueryResult) => {
        if (recipeQueryError) {
            throw recipeQueryError;
        }
        console.log(recipeQueryResult.rows);
        res.render('./admin_panel/recipe_management', { layout: 'layout_admin_panel', recipeInfo: recipeQueryResult.rows });
    });
});

router.get('/user_management/details', (req, res) => {
    res.render('./admin_panel/user_management_details', { layout: 'layout_admin_panel'});
});

module.exports = router;
