const express = require('express');
const router = express.Router();
const pgClient = require('../../db/PGController');

router.post('/', async (req, res, next) => {
    const addVoteQueryString = `
    INSERT INTO user_votes (user_id, recipe_id, score, date_of_vote) VALUES
    ($1, $2, $3, TO_TIMESTAMP($4/ 1000.0));`;

    const { recipeId, vote: score, voteDate: date } = req.body;

    const userId = res.locals.userId;

    const getNumberOfVotesPerRecipeQueryString = `
    SELECT 
        COUNT(*) AS number_of_votes,
        ROUND(AVG(uvo.score), 2) AS average_score
    FROM user_votes uvo 
        INNER JOIN recipes rec ON uvo.recipe_id = rec.id_recipe
    WHERE uvo.recipe_id = $1;`;

    const updateRecipeScoreQueryString = `
    UPDATE recipes
    SET score = $1, 
    date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0)
    WHERE id_recipe = $2;`;

    const client = await pgClient.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query(addVoteQueryString, [userId, recipeId, score, date]);
        const query = await client.query(getNumberOfVotesPerRecipeQueryString, [recipeId]);
        let numberOfVotes = query.rows[0]["number_of_votes"];
        let averageScore = query.rows[0]["average_score"];
        await client.query(updateRecipeScoreQueryString, [averageScore, recipeId]);
        await client.query("COMMIT");
        res.json(result.rows);
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
            return next(er);
        });
        console.error(e);
        return next(e);
    } finally {
        client.release();
    }
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