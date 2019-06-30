module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Zaloguj się, aby mieć dostęp do tej strony.');
      res.redirect('/login');
    },
    ensureLoggedIn: function(req, res, next) {
      if (req.isAuthenticated()) {
        req.flash('error_msg', 'Jesteś już zalogowany.');
        res.redirect('/recipes');
      } else {
        next();
      }
    }
  };