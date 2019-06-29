const LocalStrategy = require('passport-local').Strategy;
const pgClient = require('./../db/pg-controller');
const argon2 = require('argon2');

module.exports =  function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email_address', passwordField: 'password'}, (email_address, password, done) => {
            const checkIfUserExistsQuery = `SELECT * FROM users WHERE email_address = $1`;
            let userRowCount;
            pgClient.query(checkIfUserExistsQuery, [email_address], (err, result) => {
                if (err) {
                    throw err;
                    return done(err);
                }
                userRowCount = result.rowCount;

                if(userRowCount == 0){
                    return done(null, false, { message: 'User not registered' });
                } else {
                    console.log(result.rows);
                    argon2.verify(result.rows[0].password, password).then((isAuthorised) => {
                        if(isAuthorised) {
                            return done(null, result.rows[0]);
                        } else {
                            return done(null, false, { message: 'Password incorrect' });
                        }
                    });
                }
            });
        })
    );

    passport.serializeUser(function(user, done) {
        console.log(user.id_user);
        done(null, user.id_user);
    });

    passport.deserializeUser(function(id, done) {
        const findUserOfCertainID = `SELECT * FROM users WHERE id_user = $1`;
        pgClient.query(findUserOfCertainID, [id], (err, result) => {
            done(err, result.rows[0]);
        });
    });
}