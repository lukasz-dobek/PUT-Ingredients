const express = require('express');
const argon2 = require('argon2');
const router = express.Router();
const pgClient = require('./../db/pg-controller');
const mailClient = require('../MailController');
const crypto = require('crypto');
const passport = require('passport');
const { ensureLoggedIn } = require('../config/auth');

// /* GET home page. */
router.get('/', function (req, res, next) {
  res.render('landing_page', {layout: 'layout_before_login'});
});


router.get('/login', ensureLoggedIn, function (req, res, next) {
  console.log(res.locals.error);
  res.render('login', { layout: 'layout_before_login' });
});

router.post('/login', passport.authenticate('local', { 
  successRedirect: '/recipes', 
  failureRedirect: '/login', 
  failureFlash: true 
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Zostałeś poprawnie wylogowany.');
  res.redirect('/login');
});

router.get('/register', ensureLoggedIn, function (req, res, next) {
  res.render('register', { layout: 'layout_before_login'});
});

router.get('/after_register', ensureLoggedIn, (req, res) => {
  res.render('after_register', { layout: 'layout_before_login' });
});

router.post('/register', (req, res, next) => {

  const { email, nickname, password, passwordConfirm, name, surname } = req.body;
  console.log(email, nickname, password, passwordConfirm);
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

  console.log(`Liczba kont: ${userRowCount}`);
  if (userRowCount === 0){
      errors.push({ msg: "Konto o podanym adresie istnieje już w bazie danych." });
  }

  if (errors.length > 0) {
      console.log(errors);
      res.render('register', {
          errors: errors,
          layout: 'layout_before_login'
      });
  } else {
      const emailConfirmHash = crypto.randomBytes(48);
      console.log(emailConfirmHash.toString('hex'));
      const insertQueryString = `
      INSERT INTO users (
          email_address, 
          password, 
          nickname, 
          date_of_join, 
          name, 
          surname, 
          is_admin, 
          state, 
          activation_url 
      ) VALUES (
          $1,
          $2, 
          $3, 
          to_timestamp(${Date.now() / 1000.0}), 
          $4, 
          $5, 
          FALSE,
          0, 
          '${emailConfirmHash.toString('hex')}'
          );`;

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
              
              mailClient.sendEmail(email, `confirm_email/${emailConfirmHash.toString('hex')}`);

              res.redirect('/after_register');
          })
      } catch (err) {
          throw err;
      }
  }
});

router.get('/confirm_email/:hash', (req, res) => {
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
  res.render('confirm_email', { layout: 'layout_before_login' });
});

module.exports = router;
