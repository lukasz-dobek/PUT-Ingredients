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
    UPDATE recipes SET state = 'Niezaakceptowany' WHERE id_recipe = $1`;

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

module.exports = router;