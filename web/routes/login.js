// login.js

var express = require('express');
var router = express.Router();

module.exports = function(passport){
    router.get('/', passport.authenticate('twitter'));
    router.get('/twitter/return', passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        res.redirect('/');
      });

    return router;
};