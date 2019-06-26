const LocalStrategy = require('passport-local').Strategy;
const pgClient = require('./../db/pg-controller');
const argon2 = require('argon2');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email' }, (email, password, done) => {
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
        })
    );
}