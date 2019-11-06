const express = require('express');
const pgClient = require('../../db/PGController');
const request = require('request');
const router = express.Router();

// Get user's favourites
router.get('/user_email/:email', (req, res) => {
    const userEmail = req.params.email;
    const getUserFavouritesQueryString = `
    SELECT 
        fav.recipe_id
    FROM favourites fav 
        INNER JOIN users usr on fav.user_id = usr.id_user 
    WHERE usr.email_address = $1;`;

    pgClient.query(getUserFavouritesQueryString, [userEmail], (getUserFavouritesQueryError, getUserFavouritesQueryResult) => {
        if (getUserFavouritesQueryError) {
            throw getUserFavouritesQueryError;
        }
        res.json(getUserFavouritesQueryResult.rows);
    });
});

const sendDataToEngine = (user, recipe) => {
    request.post(`http://localhost:3001/users/${user}`, {
        json: {
            favourites: recipe,
        }
    }, (error, response, body) => {
        console.log(error);
        // console.log(response);
    });

    request.post(`http://localhost:3001/recipes/${recipe}`, {
        json: {
            fans: user,
        }
    }, (error, response, body) => {
        console.log(error);
        // console.log(response);
    })
};

const removeDataFromEngine = (user, recipe) => {
    request.delete(`http://localhost:3001/users/${user}`, {
        json: {
            favourites: recipe,
        }
    }, (error, response, body) => {
        console.log(error);
        // console.log(response);
    });
    request.delete(`http://localhost:3001/recipes/${recipe}`, {
        json: {
            fans: user,
        }
    }, (error, response, body) => {
        console.log(error);
        // console.log(response);
    });
};

router.get('/recommendations', (req, res) => {
    // get recommendations for current user
    request(`http://localhost:3001/recommendations/${res.locals.userId}`, (error, response, body) => {
        res.json(JSON.parse(body));
    });
});

router.post('/', (req, res) => {
    const addToFavouritesQueryString = `
    INSERT INTO favourites (user_id, recipe_id, date_of_favourite) VALUES
    ($1, $2, TO_TIMESTAMP($3 / 1000.0));
    `;
    // to_timestamp(${Date.now() / 1000.0})
    const userId = req.body.userId;
    const recipeId = req.body.recipeId;
    const addedToFavouritesDate = Date.now();
    pgClient.query(addToFavouritesQueryString, [userId, recipeId, addedToFavouritesDate], (addToFavouritesQueryError, addToFavouritesQueryResult) => {
        if (addToFavouritesQueryError) {
            throw addToFavouritesQueryError;
        }
        console.log(`POST /favourites - query successful - ${addToFavouritesQueryResult.rowCount} added`);
        sendDataToEngine(userId, recipeId);
        res.json(addToFavouritesQueryResult.rows);
    });
});

router.delete('/', (req, res) => {
    const removeFromFavouritesQueryString = `
    DELETE FROM favourites 
    WHERE user_id = $1 AND recipe_id = $2;
    `
    const userId = req.body.userId;
    const recipeId = req.body.recipeId;
    pgClient.query(removeFromFavouritesQueryString, [userId, recipeId], (removeFromFavouritesQueryError, removeFromFavouritesQueryResult) => {
        if (removeFromFavouritesQueryError) {
            throw removeFromFavouritesQueryError;
        }
        removeDataFromEngine(userId, recipeId);
        console.log(`DELETE /favourites - query successful - ${removeFromFavouritesQueryResult.rowCount} removed`);
        res.json(removeFromFavouritesQueryResult.rows);
    });
});

module.exports = router;