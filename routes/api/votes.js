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

    const getNumberOfVotesPerRecipeQueryString = `
    SELECT 
        COUNT(*) AS number_of_votes,
        ROUND(AVG(uvo.score), 2) AS average_score
    FROM user_votes uvo 
        INNER JOIN recipes rec ON uvo.recipe_id = rec.id_recipe
    WHERE uvo.recipe_id = $1;`;

    const updateRecipeScoreQueryString = `
    UPDATE recipes
    SET score = $1
    WHERE id_recipe = $2;`;


    pgClient.query(addVoteQueryString, [userId, recipeId, score, date], (addVoteQueryError, addVoteQueryResult) => {
        if (addVoteQueryError) {
            throw addVoteQueryError;
        }
        pgClient.query(getNumberOfVotesPerRecipeQueryString, [recipeId], (getNumberOfVotesPerRecipeQueryError, getNumberOfVotesPerRecipeQueryResult) => {
            if (getNumberOfVotesPerRecipeQueryError) {
                throw getNumberOfVotesPerRecipeQueryError;
            }
            let numberOfVotes = getNumberOfVotesPerRecipeQueryResult.rows[0]["number_of_votes"];
            let averageScore = getNumberOfVotesPerRecipeQueryResult.rows[0]["average_score"];
            
            pgClient.query(updateRecipeScoreQueryString, [averageScore, recipeId], (updateRecipeScoreQueryError, updateRecipeScoreQueryResult) => {
                if (updateRecipeScoreQueryError) {
                    throw updateRecipeScoreQueryError;
                }
                console.log(`POST /votes - query successful - ${addVoteQueryResult.rowCount} added`);
                res.json(addVoteQueryResult.rows);   
            });
        });
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