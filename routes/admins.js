const express = require('express');
const router = express.Router();
const pgClient = require('./../db/pg-controller');

router.get('/', (req, res) => {
    res.render('./admin_panel/main', { layout: 'layout_admin_panel' });
});

router.get('/recipes/:linkToRecipe', (req, res) => {
    const recipeQueryString = `
    SELECT 
        rec.id_recipe, 
        rec.recipe_name, 
        rec.score, 
        rec.state, 
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
        rec.visible_email,
        usr.email_address,
        usr.nickname
    FROM recipes rec 
        INNER JOIN users usr ON rec.user_id = usr.id_user 
    WHERE rec.link_to_recipe LIKE $1;`;

    const ingredientsQueryString = `
    SELECT 
        ing.ingredient_name,
        iur.amount, 
        unt.unit_name 
    FROM ingredients_used_in_recipe iur 
	    INNER JOIN ingredients ing ON iur.ingredient_id = ing.id_ingredient 
	    INNER JOIN units unt ON iur.unit_id = unt.id_unit 
    WHERE iur.recipe_id = $1;`

    const alternativeIngredientsQueryString = `
    SELECT 
    ing.ingredient_name,
    string_agg(ing_a.ingredient_name, ', ') AS alternative_ingredients
    FROM ingredients_used_in_recipe iur 
        INNER JOIN ingredients ing ON iur.ingredient_id = ing.id_ingredient 
        INNER JOIN units unt ON iur.unit_id = unt.id_unit
        INNER JOIN alternative_ingredients ai ON ing.id_ingredient = ai.ingredient_id
        INNER JOIN ingredients ing_a ON ai.replacement_id = ing_a.id_ingredient
    WHERE iur.recipe_id = $1
    GROUP BY ing.ingredient_name;
    `;

    const linkToRecipe = '/recipes/'.concat(req.params.linkToRecipe);

    pgClient.query(recipeQueryString, [linkToRecipe], (recipeQueryError, recipeQueryResult) => {
        if (recipeQueryError) throw recipeQueryError;
        const recipeId = recipeQueryResult.rows[0]["id_recipe"];
        pgClient.query(ingredientsQueryString, [recipeId], (ingredientsQueryError, ingredientsQueryResult) => {
            if (ingredientsQueryError) throw ingredientsQueryError;
            /* 
            
            Recipe fields: id_recipe, recipe_name, score, date_of_creation, complicity, preparation_time, description
            number_of_people, link_to_recipe, photo_one, photo_two, photo_three, photo_four, email_address, nickname.

            Ingredients fields: ingredient_name, amount, unit_name.

            */
            pgClient.query(alternativeIngredientsQueryString, [recipeId], (alternativeIngredientsQueryError, alternativeIngredientsQueryResult) => {
                if (alternativeIngredientsQueryError) {
                    throw alternativeIngredientsQueryError;
                }
                res.render('./admin_panel/recipe_page_admin', {
                    layout: 'layout_admin_panel',
                    recipe: recipeQueryResult.rows,
                    ingredients: ingredientsQueryResult.rows,
                    alternative_ingredients: alternativeIngredientsQueryResult.rows
                });
            });
        });
    });
});

router.get('/reports/:id', (req, res) => {
    const reportsQueryString = `
    SELECT 
        rep.id_report,
        rep.reportee_id,
        usr_a.nickname as reportee_nickname,
        rep.reported_id,
        usr_b.nickname as reported_nickname,
        usr_b.email_address as reported_email,
        rec.recipe_name,
        rep.recipe_id,
        rep.description,
        TO_CHAR(rep.date_of_report, 'DD/MM/YY') AS data,
        TO_CHAR(rep.date_of_report, 'HH24:MI:SS') AS godzina,
        CASE rep.status
            WHEN 0 THEN 'Aktywne'
            WHEN 1 THEN 'Unieważnione'
            WHEN 2 THEN 'Zweryfikowane'
        END AS status
    FROM reports rep
        INNER JOIN users usr_a ON rep.reportee_id = usr_a.id_user
        INNER JOIN users usr_b ON rep.reported_id = usr_b.id_user
        INNER JOIN recipes rec ON rep.recipe_id = rec.id_recipe
    WHERE rep.recipe_id = $1;`

    const recipeQueryString = `SELECT recipe_name FROM recipes WHERE id_recipe = $1;`;

    let recipeId = req.params.id;
    pgClient.query(reportsQueryString, [recipeId], (reportsQueryError, reportsQueryResult) => {
        if (reportsQueryError) {
            throw reportsQueryError;
        }
        pgClient.query(recipeQueryString, [recipeId], (recipeQueryError, recipeQueryResult) => {
            if (recipeQueryError) {
                throw recipeQueryError;
            }
            console.log(reportsQueryResult.rows);
            res.render('./admin_panel/reports', { layout: 'layout_admin_panel', reportsInfo: reportsQueryResult.rows, recipeName: recipeQueryResult.rows[0]["recipe_name"]});
        });
    });
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
        TO_CHAR(MAX(usa.date_of_activity), 'DD/MM/YYYY HH24:MI:SS') AS date_of_activity
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
    let stateLike;
    let groupBy = `GROUP BY usr.nickname, usr.id_user`;
    if (sortUsing === 'nickname') {
        orderBy = 'usr.nickname';
    } else if (sortUsing === 'ID') {
        orderBy = 'usr.id_user';
    } else if (sortUsing === 'email') {
        orderBy = 'usr.email_address';
    } else {
        orderBy = 'MAX(usa.date_of_activity)';
        groupBy = `GROUP BY usr.id_user`;
    }

    if (activeParam == 0) {
        stateLike = '[0]';
    } else if (activeParam == 1) {
        stateLike = '[1]';
    } else if (activeParam == 2) {
        stateLike = '[2]';
    } else if (activeParam == 3) {
        stateLike = '[3]';
    } else {
        stateLike = '[0-9]';
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
        TO_CHAR(MAX(usa.date_of_activity), 'DD/MM/YYYY HH24:MI:SS') AS date_of_activity
    FROM users usr INNER JOIN user_activities usa ON usr.id_user = usa.user_id
    WHERE usr.nickname LIKE $1 AND usr.state::varchar ~ $2`;
    userInfoQueryString += groupBy;
    userInfoQueryString += orderPart;

    pgClient.query(userInfoQueryString, [nameSearch, stateLike], (userInfoQueryError, userInfoQueryResult) => {
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
        TO_CHAR(date_of_join, 'DD/MM/YYYY') AS date_of_join,
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
        TO_CHAR(usa.date_of_activity, 'HH24:MI:SS') AS godzina,
        usa.activity_name,
        usa.link,
        usa.details
    FROM user_activities usa INNER JOIN users usr ON usa.user_id = usr.id_user
    WHERE usr.nickname = $1
    ORDER BY date_of_activity DESC;`
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
        TO_CHAR(rec.date_of_creation, 'YY/MM/DD HH24:MI:SS') as date_of_creation,
        rec.score,
        rec.link_to_recipe,
        CASE (SELECT DISTINCT 1 FROM reports rep WHERE rep.recipe_id = rec.id_recipe AND rep.status = 0 OR rep.status = 2) 
            WHEN 1 THEN 'TAK' 
            ELSE 'NIE' 
        END AS reported,
        usr.id_user,
        usr.email_address
    FROM recipes rec INNER JOIN users usr ON rec.user_id = usr.id_user;`;
    pgClient.query(recipeQueryString, (recipeQueryError, recipeQueryResult) => {
        if (recipeQueryError) {
            throw recipeQueryError;
        }
        res.render('./admin_panel/recipe_management', { layout: 'layout_admin_panel', recipeInfo: recipeQueryResult.rows });
    });
});

router.post('/recipe_management', (req, res) => {
    let activeParam = req.body.state === "Wszystkie" ? '%' : req.body.state;
    let sortUsing = req.body.sortUsing;
    let sortType = req.body.sortType;
    let nameSearch = req.body.nameSearch ? req.body.nameSearch : '%';
    let isReported = req.body.isReported == 1 ? 'NOT NULL' : 'NULL';
    console.log(isReported);
    let orderBy;

    if (sortUsing === 'date_of_creation') {
        orderBy = 'rec.date_of_creation';
    } else if (sortUsing === 'score') {
        orderBy = 'rec.score';
    } else if (sortUsing === 'name') {
        orderBy = 'rec.recipe_name';
    } else {
        orderBy = 'rec.id_recipe';
    }

    let orderPart = ` ORDER BY ${orderBy} ${sortType};`;

    let recipeInfoQueryString = `
    SELECT
        rec.id_recipe,
        rec.state,
        rec.recipe_name,
        TO_CHAR(rec.date_of_creation, 'YY/MM/DD HH24:MI:SS') as date_of_creation,
        rec.score,
        rec.link_to_recipe,
        CASE (SELECT DISTINCT 1 FROM reports rep WHERE rep.recipe_id = rec.id_recipe AND rep.status = 0 OR rep.status = 2) 
            WHEN 1 THEN 'TAK' 
            ELSE 'NIE' 
        END AS reported,
        usr.id_user,
        usr.email_address
    FROM recipes rec INNER JOIN users usr ON rec.user_id = usr.id_user
    WHERE rec.recipe_name LIKE $1 AND rec.state LIKE $2 AND (SELECT DISTINCT 1 FROM reports rep WHERE rep.recipe_id = rec.id_recipe AND rep.status = 0 OR rep.status = 2) IS ${isReported}
    GROUP BY rec.recipe_name, rec.id_recipe, usr.id_user`;

    recipeInfoQueryString += orderPart;

    pgClient.query(recipeInfoQueryString, [nameSearch, activeParam], (recipeInfoQueryError, recipeInfoQueryResult) => {
        if (recipeInfoQueryError) {
            throw recipeInfoQueryError;
        }
        res.render('./admin_panel/recipe_management', { layout: 'layout_admin_panel', recipeInfo: recipeInfoQueryResult.rows });
    });
});

router.get('/user_management/details', (req, res) => {
    res.render('./admin_panel/user_management_details', { layout: 'layout_admin_panel' });
});

module.exports = router;
