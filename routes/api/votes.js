const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');

router.post('/', (req, res) => {
    const addVoteQueryString = `
    INSERT INTO user_votes (user_id, recipe_id, score, date_of_vote) VALUES
    ($1, $2, $3, TO_TIMESTAMP($4/ 1000.0));
    `;
    const userId = res.locals.userId;
    const recipeId = req.body.recipeId;
    const score = req.body.vote;
    const date = req.body.voteDate;

    pgClient.query(addVoteQueryString, [userId, recipeId, score, date], (addVoteQueryError, addVoteQueryResult) => {
        if (addVoteQueryError) {
            throw addVoteQueryError;
        }
        console.log(`POST /votes - query successful - ${addVoteQueryResult.rowCount} added`);
        res.json(addVoteQueryResult.rows);   
    });
});

router.get('/:recipeId/:userEmail', (req, res) => {
    const getUserScoreQueryString = `
    SELECT
        uvo.score
    FROM user_votes uvo
        INNER JOIN users usr ON uvo.user_id = usr.id_user
    WHERE recipe_id = $1 AND usr.email_address = $2;`;

    const recipeId = req.params.recipeId;
    const userEmail = req.params.userEmail;

    pgClient.query(getUserScoreQueryString, [recipeId, userEmail], (getUserScoreQueryError, getUserScoreQueryResult) => {
        if (getUserScoreQueryError) {
            throw getUserScoreQueryError;
        }
        res.json(getUserScoreQueryResult.rows);
    });
});

module.exports = router;