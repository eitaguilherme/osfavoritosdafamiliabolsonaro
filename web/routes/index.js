var express = require('express');
var router = express.Router();

/* GET home page. */
router.use(function timeLog (req, res, next) {
  next()
});

router.get('/', function(req,res){
   var token = null; 
  if(req.user){
    const payload = {
      screenName: req.user.screenName,
      token: req.user.token,
      tokenSecret: req.user.tokenSecret,
    };
  }
  res.render('home', {});
});

module.exports = router;