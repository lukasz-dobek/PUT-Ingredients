const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.get('/recipes_in_month', (req, res) => {
    const recipesInMonthsQueryString = `
    SELECT 
        date_part('day', date_trunc('day', date_of_creation)) AS day,
        count(*) AS number_of_recipes
    FROM recipes
    WHERE date_of_creation > now() - interval '1 month' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(recipesInMonthsQueryString, (recipesInMonthsQueryError, recipesInMonthsQueryResult) => {
        if (recipesInMonthsQueryError) {
            throw recipesInMonthsQueryError;
        }
        res.json(recipesInMonthsQueryResult.rows)
    });

});


router.get('/user_activities_in_month', (req, res) => {
    const recipesInMonthsQueryString = `
    SELECT date_part('day', date_trunc('day', date_of_activity)) AS day , 
    count(*) AS number_of_activities
    FROM user_activities
    WHERE date_of_activity > now() - interval '1 month' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(recipesInMonthsQueryString, (recipesInMonthsQueryError, recipesInMonthsQueryResult) => {
        if (recipesInMonthsQueryError) {
            throw recipesInMonthsQueryError;
        }
        res.json(recipesInMonthsQueryResult.rows)
    });

});

router.get('/user_activities_in_week', (req, res) => {
    const recipesInMonthsQueryString = `
    select
    CASE extract(dow from date_of_activity)
      
        WHEN 0 THEN 'Niedziela'
        WHEN 1 THEN 'Poniedziałek'
        WHEN 2 THEN 'Wtorek'
        WHEN 3 THEN 'Środa'
        WHEN 4 THEN 'Czwartek'
        WHEN 5 THEN 'Piątek'
        WHEN 6 THEN 'Sobota'

    END AS dzien_tygodnia,
    count(id_user_activity) AS new_activity_per_day
    from user_activities
    WHERE date_of_activity::date BETWEEN now()::date -7 AND now()::date
    group by dzien_tygodnia`;
    pgClient.query(recipesInMonthsQueryString, (recipesInMonthsQueryError, recipesInMonthsQueryResult) => {
        if (recipesInMonthsQueryError) {
            throw recipesInMonthsQueryError;
        }
        res.json(recipesInMonthsQueryResult.rows)
    });

});

router.get('/user_activities_in_year', (req, res) => {
    const recipesInMonthsQueryString = `
    SELECT CASE date_part('month', date_trunc('month', date_of_activity))
        WHEN 1 THEN 'Styczeń'
         WHEN 2 THEN 'Luty'
        WHEN 3 THEN 'Marzec'
        WHEN 4 THEN 'Kwiecień'
        WHEN 5 THEN 'Maj'
        WHEN 6 THEN 'Czerwiec'
        WHEN 7 THEN 'Lipiec'
        WHEN 8 THEN 'Sierpień'
        WHEN 9 THEN 'Wrzesień'
        WHEN 10 THEN 'Październik'
        WHEN 11 THEN 'Listopad'
        WHEN 12 THEN 'Grudzień'
    END AS month , count(*) AS number_of_activites
    FROM user_activities
    WHERE date_of_activity > now() - interval '1 year' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(recipesInMonthsQueryString, (recipesInMonthsQueryError, recipesInMonthsQueryResult) => {
        if (recipesInMonthsQueryError) {
            throw recipesInMonthsQueryError;
        }
        res.json(recipesInMonthsQueryResult.rows)
    });

});

router.get('/users_in_month', (req, res) => {
    const usersInMonthsQueryString = `
    SELECT 
        date_part('day', date_trunc('day', date_of_join)) AS day , 
        count(*) AS number_of_users
    FROM users
    WHERE date_of_join > now() - interval '1 month' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(usersInMonthsQueryString, (usersInMonthsQueryError, usersInMonthsQueryResult) => {
        if (usersInMonthsQueryError) {
            throw usersInMonthsQueryError;
        }
        res.json(usersInMonthsQueryResult.rows)
    });

});

router.get('/users_per_week', (req, res) => {
    const usersPerWeekQueryString = `
    SELECT
    CASE extract(dow FROM date_of_join)
        WHEN 1 THEN 'Poniedziałek'
        WHEN 2 THEN 'Wtorek'
        WHEN 3 THEN 'Środa'
        WHEN 4 THEN 'Czwartek'
        WHEN 5 THEN 'Piątek'
        WHEN 6 THEN 'Sobota'
        WHEN 0 THEN 'Niedziela'
    END AS day_of_week,
    count(id_user) AS new_users_per_day
    FROM users
    WHERE date_of_join::date BETWEEN now()::date-7 AND now()::date 
    GROUP BY day_of_week;`;
    pgClient.query(usersPerWeekQueryString, (usersPerWeekQueryError, usersPerWeekQueryResult) => {
        if (usersPerWeekQueryError) {
            throw usersPerWeekQueryError;
        }
        res.json(usersPerWeekQueryResult.rows)
    });

});


router.get('/users_in_year', (req, res) => {
    const usersInYearQueryString = `
    SELECT 
    CASE date_part('month', date_trunc('month', date_of_join))
        WHEN 1 THEN 'Styczeń'
        WHEN 2 THEN 'Luty'
        WHEN 3 THEN 'Marzec'
        WHEN 4 THEN 'Kwiecień'
        WHEN 5 THEN 'Maj'
        WHEN 6 THEN 'Czerwiec'
        WHEN 7 THEN 'Lipiec'
        WHEN 8 THEN 'Sierpień'
        WHEN 9 THEN 'Wrzesień'
        WHEN 10 THEN 'Październik'
        WHEN 11 THEN 'Listopad'
        WHEN 12 THEN 'Grudzień'
    END AS month,
    count(*) AS number_of_users
    FROM users
    WHERE date_of_join > now() - interval '1 year' 
    GROUP BY 1
    ORDER BY 1;`;
    pgClient.query(usersInYearQueryString, (usersInYearQueryError, usersInYearQueryResult) => {
        if (usersInYearQueryError) {
            throw usersInYearQueryError;
        }
        res.json(usersInYearQueryResult.rows)
    });

});

module.exports = router;
