// profile.js

var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('profile', { user: req.user });
 });
    
module.exports = router;