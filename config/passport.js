const LocalStrategy = require('passport-local').Strategy;
const pgClient = require('./../db/pg-controller');
const argon2 = require('argon2');

module.exports =  function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email_address', passwordField: 'password'}, (email_address, password, done) => {
            const checkIfUserExistsQueryString = `SELECT * FROM users WHERE email_address = $1`;
            let userRowCount;
            pgClient.query(checkIfUserExistsQueryString, [email_address], (checkIfUserExistsQueryError, checkIfUserExistsQueryResult) => {
                if (checkIfUserExistsQueryError) {
                    throw checkIfUserExistsQueryError;
                    return done(checkIfUserExistsQueryError);
                }
                userRowCount = checkIfUserExistsQueryResult.rowCount;

                if(userRowCount == 0){
                    return done(null, false, { message: 'Użytkownik o podanym adresie nie istnieje.' });
                } else if (checkIfUserExistsQueryResult.rows[0]["state"] === 0){
                    return done(null, false, { message: 'Użytkownik o podanym adresie nie potwierdził rejestracji za pomocą linka aktywacyjnego.' });
                } else if (checkIfUserExistsQueryResult.rows[0]["state"] === 2){
                    return done(null, false, { message: 'Użytkownik o podanym adresie został zbanowany.' });
                } else if (checkIfUserExistsQueryResult.rows[0]["state"] === 3){
                    return done(null, false, { message: 'Konto użytkownika o podanym adresie zostało usunięte.' });
                } else {
                    argon2.verify(checkIfUserExistsQueryResult.rows[0].password, password).then((isAuthorised) => {
                        if(isAuthorised) {
                            const user = {
                                id_user: checkIfUserExistsQueryResult.rows[0]["id_user"],
                                email_address: checkIfUserExistsQueryResult.rows[0]["email_address"],
                                nickname: checkIfUserExistsQueryResult.rows[0]["nickname"],
                                name: checkIfUserExistsQueryResult.rows[0]["name"],
                                surname: checkIfUserExistsQueryResult.rows[0]["surname"],
                                is_admin: checkIfUserExistsQueryResult.rows[0]["is_admin"],
                                state: checkIfUserExistsQueryResult.rows[0]["state"]
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