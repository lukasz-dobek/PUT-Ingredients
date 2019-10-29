const express = require('express');
const pgClient = require('../../db/PGController');
const router = express.Router();

router.get('/', (req, res) => {
    // todo
});

router.post('/revoke_report', (req, res) => {
    const revokeReportQueryString = `
    UPDATE reports SET status = 1 WHERE id_report = $1`;

    const recipeStateQueryString = `
    UPDATE recipes SET state = 'Zweryfikowany' WHERE id_recipe = $1`;

    let reportId = req.body.reportId;
    let recipeId = req.body.recipeId;

    pgClient.query(revokeReportQueryString, [reportId], (revokeReportQueryError, revokeReportQueryResult) => {
        if (revokeReportQueryError) {
            throw revokeReportQueryError;
        }
        pgClient.query(recipeStateQueryString, [recipeId], (recipeStateQueryError, recipeStateQueryResult) => {
            if (recipeStateQueryError) {
                throw recipeStateQueryError;
            }
            res.json(recipeStateQueryResult.rows);
        });
    });
});

router.post('/accept_report', (req, res) => {
    const acceptReportQueryString = `
    UPDATE reports SET status = 2 WHERE id_report = $1`;

    const recipeStateQueryString = `
    UPDATE recipes SET state = 'Niezaakceptowany', date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE id_recipe = $1`;

    let reportId = req.body.reportId;
    let recipeId = req.body.recipeId;

    pgClient.query(acceptReportQueryString, [reportId], (acceptReportQueryError, acceptReportQueryResult) => {
        if (acceptReportQueryError) {
            throw acceptReportQueryError;
        }
        pgClient.query(recipeStateQueryString, [recipeId], (recipeStateQueryError, recipeStateQueryResult) => {
            if (recipeStateQueryError) {
                throw recipeStateQueryError;
            }
            res.json(recipeStateQueryResult.rows);
        });
    });
});



router.post('/accept_report_transact', async (req, res, e) => {
    const client = await pgClient.connect();


    try {

        const acceptReportQueryString = `
    UPDATE reports SET status = 2 WHERE id_report = $1`;

        const recipeStateQueryString = `
    UPDATE recipes SET state = 'Niezaakceptowany', date_of_modification = TO_TIMESTAMP(${Date.now()} / 1000.0) WHERE id_recipe = $1`;

        const testQS = `
    DELETE FROM units WHERE unit_namelol = 'trolle'`;

        const { reportId, recipeId } = req.body;

        await client.query('BEGIN');
        await client.query(acceptReportQueryString, [reportId]);
        await client.query(recipeStateQueryString, [recipeId]);
        await client.query(testQS);
        await client.query('COMMIT');
        res.json(result.rows);
    } catch (e) {
        await client.query('ROLLBACK').catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release()
    }
});

module.exports = router;