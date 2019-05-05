var express = require('express');
var router = express.Router();
const pgClient = require('./../db/pg-controller');

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/register', function (req, res, next) {
    res.render('register');
});

router.get('/after_register', (req, res) => {
    res.render('after_register');   
});

router.post('/register', (req, res, next) => {
    let email = req.body.email;
    let nickname = req.body.nickname;
    let password = req.body.password;
    let passwordConfirm = req.body.passwordconfirm;
    let name = req.body.name;
    let surname = req.body.surname;

    console.log(`${email}, ${nickname}`);

    const insertQueryString = `INSERT INTO users (email_address, password, nickname, date_of_join, name, surname, is_admin, state, activation_url, url_status, salt) VALUES ($1, $2, $3, to_timestamp(${Date.now() / 1000.0}), $4, $5, '0', 4, 'abc', '0', 'abcdefghj');`
    pgClient.query(insertQueryString, [email, password, nickname, name, surname], (err, result) => {
        if (err) {
            throw err;
            res.render('error');
        }
        console.log(result);
    })
    res.redirect('/users/after_register');
});

router.get('/api/all', (req, res) => {
    pgClient.query('SELECT * FROM users', (err, result) => {
        res.json(result.rows);
    });
});

router.get('/api/:id', (req, res) => {
    const queryString = 'SELECT * FROM users WHERE id_user = $1';
    const value = [parseInt(req.params.id)];

    pgClient.query(queryString, value, (err, result) => {
        if (err) throw err;
        res.json(result.rows);
    });
});

module.exports = router;
