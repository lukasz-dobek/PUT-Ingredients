var express = require('express');
var router = express.Router();

// /* GET home page. */
router.get('/', function (req, res, next) {
  res.render('landing_page', {layout: 'layout_before_login'});
});

router.get('/terms_of_use', (req, res) => {
  res.render('terms_of_use', {layout: 'layout_before_login'});
});

module.exports = router;
