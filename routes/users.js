const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');

router.get('/login', function (req, res, next) {
    console.log(res.locals.error);
    res.render('./users/login', { layout: 'layout_before_login' });
});

router.post('/login', passport.authenticate('local', { 
    successRedirect: '/recipes', 
    failureRedirect: '/users/login', 
    failureFlash: true 
}));

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Zostałeś poprawnie wylogowany.');
    res.redirect('/users/login');
  });

router.get('/register', function (req, res, next) {
    res.render('./users/register', { layout: 'layout_before_login'});
});

router.get('/after_register', (req, res) => {
    res.render('./users/after_register', { layout: 'layout_before_login' });
});

router.post('/register', (req, res, next) => {

    const { email, nickname, password, passwordConfirm, name, surname } = req.body;
    console.log(email, nickname, password, passwordConfirm);
    let errors = [];

    if (!nickname || !email || !password || !passwordConfirm) {
        errors.push({ msg: "Please fill in all necessary fields" });
    }

    if (password !== passwordConfirm) {
        errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 6) {
        errors.push({ msg: "Password should be at least 8 characters" });
    }

    const checkIfUserExistsQuery = `SELECT email_address FROM users WHERE email_address = $1`;

    let userRowCount;
    
    pgClient.query(checkIfUserExistsQuery, [email], (err, result) => {
        if (err) {
            throw err;
            res.render('error');
        }
        console.log(result.rows);
        userRowCount = result.rowCount;
    })

    if (userRowCount === 0){
        errors.push({ msg: "Email already exists in database" });
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render('./users/register', {
            errors: errors,
            layout: 'layout_before_login'
        });
    } else {
        const emailConfirmHash = crypto.randomBytes(48);
        console.log(emailConfirmHash.toString('hex'));
        const insertQueryString = `INSERT INTO users 
            (email_address, password, nickname, date_of_join, name, surname, is_admin, state, activation_url, url_status, salt)
            VALUES ($1, $2, $3, to_timestamp(${Date.now() / 1000.0}), $4, $5, '0', 4, '${emailConfirmHash.toString('hex')}', '0', 'abcdefghj');`;

        try {
            argon2.hash(password).then(hash => {
                console.log(hash.length);
                console.log(hash);
                pgClient.query(insertQueryString, [email, hash, nickname, name, surname], (err, result) => {
                    if (err) {
                        throw err;
                        res.render('error');
                    }
                    console.log(result);
                })
                
                mailClient.sendEmail(email, `users/confirm_email/${emailConfirmHash.toString('hex')}`);

                res.redirect('/users/after_register');
            })
        } catch (err) {
            throw err;
        }
    }
});

router.get('/confirm_email/:hash', (req, res) => {
    console.log("test");
    console.log(req.params.hash.toString);
    const updateQueryString = `UPDATE users SET state=1 WHERE activation_url = $1`;
    pgClient.query(updateQueryString, [req.params.hash], (err, result) => {
        if (err) {
            throw err;
            res.render('error');
        }
        if (result.rowCount === 0){
            console.log("nie bylo takiego hashu");
        } else {
            console.log("udalo sie");
        }
        console.log(result);
    })
    res.render('./users/confirm_email', { layout: 'layout_before_login' });
});

module.exports = router;
