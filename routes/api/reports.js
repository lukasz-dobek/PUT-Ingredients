const express = require('express');
const pgClient = require('../../db/PGController');
const router = express.Router();

router.get('/', (req, res) => {
    // todo
});

router.post('/revoke_report', async (req, res) => {
    const client = await pgClient.connect();
    const { reportId, recipeId } = req.body;

    const revokeReportQueryString = 
    `UPDATE reports SET status = 1 WHERE id_report = $1`;

    const recipeStateQueryString = 
    `UPDATE recipes SET state = 'Zweryfikowany' WHERE id_recipe = $1`;
    
    try {
        await client.query('BEGIN');
        await client.query(revokeReportQueryString, [reportId]);
        const result = await client.query(recipeStateQueryString, [recipeId]);
        await client.query('COMMIT');
        res.json(result.rows);
    } catch (e) {
        await client.query('ROLLBACK').catch(er => {
            console.log(er);
            return next(er);
        });
        console.log(e);
        return next(e);
    } finally {
        client.release()
    }
});

router.post('/accept_report', async (req, res, e) => {
    const client = await pgClient.connect();
    const { reportId, recipeId } = req.body;
    const acceptReportQueryString =
        `UPDATE reports SET status = 2 WHERE id_report = $1`;

    const recipeStateQueryString =
        `UPDATE recipes SET state = 'Niezaakceptowany', date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE id_recipe = $1`;

    try {
        await client.query('BEGIN');
        await client.query(acceptReportQueryString, [reportId]);
        const result = await client.query(recipeStateQueryString, [recipeId]);
        await client.query('COMMIT');
        res.json(result.rows);
    } catch (e) {
        await client.query('ROLLBACK').catch(er => {
            console.log(er);
            return next(er);
        });
        console.log(e);
        return next(e);
    } finally {
        client.release()
    }
});

module.exports = router;