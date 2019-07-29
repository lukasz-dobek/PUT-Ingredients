const express = require('express');
const router = express.Router();
const pgClient = require('../../db/pg-controller');
const mailClient = require('../../MailController');

router.get('/all', (req, res) => {
    pgClient.query('SELECT * FROM users', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/email/:email',(req,res)=>{
    const  queryString = `SELECT * FROM users WHERE email_address = $1`;
    const emailValue = req.params.email;
    pgClient.query(queryString,[emailValue],(err,result)=>{
        if(err) throw err;
        res.json(result.rows);
    })
});

router.get('/nickname/:nickname',(req,res)=>{
    const  queryString = `SELECT LOWER(nickname) FROM users WHERE LOWER(nickname) = $1`;
    const nicknameValue = req.params.nickname;
    pgClient.query(queryString,[nicknameValue],(err,result)=>{
        if(err) throw err;
        res.json(result.rowCount);
    })
});

router.get('/id/:id', (req, res) => {
    const queryString = 'SELECT * FROM users WHERE id_user = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        console.log(result.rows);
        res.json(result.rows);
    });
});

router.post('/send_email', (req, res) => {
    let messageContent = req.body.message;
    let userEmail = req.body.send_to;
    let adminEmail = req.body.sent_from;

    let subject = 'Ingredients - Otrzymałeś wiadomość od administratora!';
    let message = `${messageContent} <br><br> Wiadomość została wysłana za pomocą panelu administracyjnego. W celu bezkonfliktowego kontaktu proszę odpowiedz na adres ${adminEmail}.`;

    mailClient.sendEmail(userEmail, subject, message);
    res.send('Mail sent.');
});

router.post('/send_shopping_list', (req, res) => {
    let messageContent = req.body.message;
    let userEmail = req.body.send_to;
    let recipe = req.body.recipe;

    let subject = 'Ingredients - Lista zakupów dla:'+recipe+'!';
    let message = `${messageContent}`;

    mailClient.sendEmail(userEmail, subject, message);
    res.send('Mail sent.');
});

router.post('/block_user', (req, res, next) => {
    const blockUserQueryString = `
    UPDATE users SET state = 2 WHERE nickname = $1;`;

    pgClient.query(blockUserQueryString, [req.body.blockedNickname], (blockUserQueryError, blockUserQueryResult) => {
        if (blockUserQueryError) {
            throw blockUserQueryError;
        }
        console.log(`Blocked user ${req.body.blockedNickname} - updated rows - ${blockUserQueryResult.rowCount}`);
        res.json(blockUserQueryResult.rows);
    });
});

router.post('/unblock_user', (req, res, next) => {
    const unblockUserQueryString = `
    UPDATE users SET state = 1 WHERE nickname = $1;`;

    console.log(req.body.unblockedNickname);

    pgClient.query(unblockUserQueryString, [req.body.unblockedNickname], (unblockUserQueryError, unblockUserQueryResult) => {
        if (unblockUserQueryError) {
            throw unblockUserQueryError;
        }
        console.log(`Unblocked user ${req.body.unblockedNickname} - updated rows - ${unblockUserQueryResult.rowCount}`);
        res.json(unblockUserQueryResult.rows);
    });
});

router.get('/shopping_list',(req, res)=>{
    const userShoppingListQueryString=`
    SELECT
        recipe_name
    FROM recipes r
        JOIN shop_lists sl ON r.id_recipe=sl.recipe_id
        JOIN users u ON u.id_user=sl.user_id
    WHERE u.id_user = $1;`

    const userId = res.locals.userId;
    pgClient.query(userShoppingListQueryString, [userId], (userShoppingListQueryError, userShoppingListQueryResult) => {
        if(userShoppingListQueryError) {
            throw userShoppingListQueryError;
        }
        console.log(userShoppingListQueryResult.rows);
        res.json(userShoppingListQueryResult.rows);
    });
});

router.get('/shopping_list/:recipeId',(req, res)=>{
    const queryString=`
        SELECT * FROM shop_lists sl JOIN recipes r on r.id_recipe=sl.recipe_id
        WHERE sl.user_id = $1 and sl.recipe_id = $2`

    const userId = res.locals.userId;
    const recipeId = req.params.recipeId;

    pgClient.query(queryString, [userId,recipeId], (userShoppingListQueryError, userShoppingListQueryResult) => {
        if(userShoppingListQueryError) {
            throw userShoppingListQueryError;
        }
        console.log(userShoppingListQueryResult.rows);
        res.json(userShoppingListQueryResult.rowCount);
    });

});

module.exports = router;