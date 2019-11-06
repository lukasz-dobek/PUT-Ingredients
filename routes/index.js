const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('../db/PGController');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');
const { ensureLoggedIn } = require('../config/auth');

router.get('/', function (req, res, next) {
    res.render('./index/landing_page', { layout: 'layout_before_login' });
});

router.get('/login', ensureLoggedIn, function (req, res, next) {
    res.render('./index/login', { layout: 'layout_before_login' });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { req.flash('error', info.message); return res.redirect('/login') }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            const insertActivityQueryString = `
            INSERT INTO user_activities (
                user_id,
                date_of_activity,
                activity_name,
                details) VALUES ($1, TO_TIMESTAMP($2/1000.0), 'Logowanie', $3)`;
            pgClient.query(insertActivityQueryString, [user['id_user'], Date.now(), req.headers['user-agent']], (err, result) => {
                if (err) { throw err }
                res.redirect('/recipes');
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Zostałeś poprawnie wylogowany.');
    res.redirect('/login');
});

router.get('/forgot_password', ensureLoggedIn, (req, res) => {
    res.render('./index/forgot_password', { layout: 'layout_before_login' });
});

router.post('/forgot_password', async (req, res) => {
    const email = req.body.email;
    const checkIfUserExistsQueryString = `SELECT email_address FROM users WHERE email_address = $1`;

    const client = await pgClient.connect();
    try {
        await client.query("BEGIN");
        const qr = await client.query(checkIfUserExistsQueryString, [email]);
        let userRowCount = qr.rowCount;
        if (userRowCount === 0) {
            req.flash("error_msg", "Konto o podanym adresie nie istnieje.");
            res.redirect('/login');
        } else {
            const resetPasswordHash = crypto.randomBytes(48);
            const resetPasswordHashQueryString =
                `UPDATE users SET reset_password_url = $1 WHERE email_address = $2`;
            await client.query(resetPasswordHashQueryString, [resetPasswordHash.toString('hex'), email]);
            await client.query("COMMIT");
            let subject = "Ingredients - Zresetuj hasło";
            let message = `<a href="http://localhost:3000/reset_password/${resetPasswordHash.toString('hex')}">Kliknij, aby ukończyć proces zmiany hasła!</a>`;
            mailClient.sendEmail(email, subject, message);
            req.flash('success_msg', "Wiadomość na Twój adres e-mail została wysłana. Zresetuj hasło z jej pomocą.");
            res.redirect('/login');
        }
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/reset_password/:hash', (req, res) => {
    const hash = req.params.hash;
    const checkIfUserExistsQueryString = `SELECT email_address FROM users WHERE reset_password_url = $1`;
    pgClient.query(checkIfUserExistsQueryString, [hash], (checkIfUserExistsQueryError, checkIfUserExistsQueryResult) => {
        if (checkIfUserExistsQueryError) {
            throw checkIfUserExistsQueryError;
            res.render('error');
        }
        userRowCount = checkIfUserExistsQueryResult.rowCount;
        if (userRowCount === 0) {
            req.flash("error_msg", "Taki link resetujący hasło nie występuje w bazie.");
            res.redirect('/login');
        } else {
            res.render('./index/reset_password', { url: hash, layout: 'layout_before_login' });
        }
    });
});

router.post('/reset_password/:hash', async (req, res) => {
    const hash = req.params.hash;
    const checkIfUserExistsQueryString =
        `SELECT email_address FROM users WHERE reset_password_url = $1`;
    const updatePasswordQueryString =
        `UPDATE users SET password = $1, reset_password_url = '' WHERE reset_password_url = $2;`;

    const client = await pgClient.connect();

    try {
        await client.query("BEGIN");
        const qr = await client.query(checkIfUserExistsQueryString, [hash]);
        let userRowCount = qr.rowCount;
        if (userRowCount === 0) {
            req.flash("error_msg", "Taki link resetujący hasło nie występuje w bazie.");
            res.redirect("/login");
        } else {
            const { password, passwordConfirm } = req.body;
            let errors = [];
            if (password !== passwordConfirm) {
                errors.push({ msg: "Hasła się nie zgadzają." });
            }
            if (password.length < 6) {
                errors.push({ msg: "Hasło powinno składać się z przynajmniej 8 znaków." });
            }
            argon2.hash(password).then(async hashedPassword => {
                await client.query(updatePasswordQueryString, [hashedPassword, hash]);
                await client.query("COMMIT");
                req.flash('success_msg', 'Hasło zmienione poprawnie!');
                res.redirect('/login');
            }).catch(hashErr => {
                throw hashErr;
            });
        }
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/register', ensureLoggedIn, function (req, res, next) {
    res.render('./index/register', { layout: 'layout_before_login' });
});

router.get('/after_register', ensureLoggedIn, (req, res) => {
    res.render('./index/after_register', { layout: 'layout_before_login' });
});

router.post('/register', async (req, res) => {

    const { email, nickname, password, passwordConfirm, name, surname } = req.body;
    let errors = [];

    if (!nickname || !email || !password || !passwordConfirm) {
        errors.push({ msg: "Wypełnij wszystkie potrzebne pola." });
    }

    if (password !== passwordConfirm) {
        errors.push({ msg: "Hasła się nie zgadzają." });
    }

    if (password.length < 6) {
        errors.push({ msg: "Hasło powinno składać się z przynajmniej 6 znaków." });
    }

    const checkIfUserExistsQuery =
        `SELECT nickname,email_address FROM users WHERE email_address = $1 OR nickname = $2`;

    let userRowCount;
    const client = await pgClient.connect();

    try {
        await client.query("BEGIN");
        const qr = await client.query(checkIfUserExistsQuery, [email, nickname]);
        userRowCount = qr.rowCount;

        if (userRowCount !== 0) {
            errors.push({ msg: "Konto o podanym adresie/loginie istnieje już w bazie danych." });
        }

        if (errors.length > 0) {
            res.render('./index/register', {
                errors: errors,
                layout: 'layout_before_login'
            });
        } else {
            const emailConfirmHash = crypto.randomBytes(48);
            const insertQueryString =
                `INSERT INTO users (
                    email_address, 
                    password, 
                    nickname, 
                    date_of_join, 
                    name, 
                    surname, 
                    is_admin, 
                    state, 
                    activation_url
                    ) VALUES ($1, $2, $3, to_timestamp(${Date.now() / 1000.0}), $4, $5, FALSE, 0, '${emailConfirmHash.toString('hex')}');`;
            argon2.hash(password).then(async hash => {
                await client.query(insertQueryString, [email, hash, nickname, name, surname]);
                let subject = 'Ingredients - Dokończ proces rejestracji';
                let message = `<a href="http://localhost:3000/confirm_email/${emailConfirmHash.toString('hex')}">Kliknij, aby ukończyć proces rejestracji!</a>`;
                mailClient.sendEmail(email, subject, message);
                await client.query("COMMIT");
                res.redirect('/after_register');
            }).catch(hashErr => {
                throw hashErr;
            });
        }
    } catch (e) {
        await client.query("ROLLBACK").catch(er => {
            console.log(er);
        });
        return e;
    } finally {
        client.release();
    }
});

router.get('/confirm_email/:hash', (req, res) => {
    const confirmEmailQueryString = "UPDATE users SET state=1, activation_url = '' WHERE activation_url = $1";
    const activationUrlHashValue = req.params.hash;
    pgClient.query(confirmEmailQueryString, [activationUrlHashValue], (confirmEmailQueryError, confirmEmailQueryResult) => {
        if (confirmEmailQueryError) {
            throw confirmEmailQueryError;
            res.render('error');
        }
        if (confirmEmailQueryResult.rowCount === 0) {
            req.flash('error_msg', 'Nie ma takiego linku aktywacyjnego w bazie.');
            res.redirect('/login');
        } else {
            res.render('./index/confirm_email', { layout: 'layout_before_login' });
        }
    });
});

router.get('/authors', (req, res) => {
    res.render('./index/authors', { layout: 'layout_before_login' });
});

module.exports = router;
