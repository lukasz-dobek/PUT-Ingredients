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
                    return done(null, false, { message: 'Użytkownik o podanym adresie nie istnieje.' });
                } else {
                    argon2.verify(result.rows[0].password, password).then((isAuthorised) => {
                        if(isAuthorised) {
                            const user = {
                                id_user: result.rows[0]["id_user"],
                                email_address: result.rows[0]["email_address"],
                                nickname: result.rows[0]["nickname"],
                                name: result.rows[0]["name"],
                                surname: result.rows[0]["surname"],
                                is_admin: result.rows[0]["is_admin"],
                                state: result.rows[0]["state"]
                            }
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Hasło niepoprawne.' });
                        }
                    });
                }
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id_user);
    });

    passport.deserializeUser(function(id, done) {
        const findUserOfCertainID = `SELECT * FROM users WHERE id_user = $1`;
        pgClient.query(findUserOfCertainID, [id], (err, result) => {
            const user = {
                id_user: result.rows[0]["id_user"],
                email_address: result.rows[0]["email_address"],
                nickname: result.rows[0]["nickname"],
                name: result.rows[0]["name"],
                surname: result.rows[0]["surname"],
                is_admin: result.rows[0]["is_admin"],
                state: result.rows[0]["state"]
            }
            done(err, user);
        });
    });
}