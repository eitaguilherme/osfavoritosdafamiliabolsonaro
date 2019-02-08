var express =         require("express");
var path =            require('path');
var logger =          require("morgan");
var cookieParser =    require("cookie-parser");
var bodyParser =      require("body-parser");
var passport =        require('passport');
var Strategy =        require('passport-twitter').Strategy;

let callback_url =  "http://127.0.0.1:3030/";

const databaseConfig = require('../config/database');
const mongoose = require('mongoose');
mongoose.connect(databaseConfig.connectionString, (err) => { 
    if(err) {
        console.log(err);
    };
 });

 const Config = require('../models/config.model');

passport.use(new Strategy({
    consumerKey: 'MUYMQmQMhRDBXLzPtQ',
    consumerSecret: 'sHG5ZtCMTe8JscVtcjWje18ljAgAvgYnuFsfcMlUc',
    callbackURL:  callback_url.concat('login/twitter/return')
  },
  function(token, tokenSecret, profile, cb) {
    var _screenName = profile.username;
    var _profilePhoto = profile.photos[0].value;
    
     var userSession = {
       screenName: _screenName,
       profilePhoto : _profilePhoto,
       token: token,
       tokenSecret: tokenSecret
    };

    console.log(_screenName);

    Config.findOne({ screenname: _screenName })
        .then((config => {
            if(!config){
                config = new Config({
                    screenname: _screenName,
                    accessTokenSecret: tokenSecret,
                    accessToken: token
                });
                config.save((err) => {
                    if(err) console.log('ocorreu um erro ao inserir');
                    else
                        return cb(null, userSession);
                })
            }else
                return cb(null, userSession);
        }))
}));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// Web Express App
// ---------------
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
console.log('public > ', path.join(__dirname, "public"));

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Routes
// ------

var indexRoute = require('../web/routes/index');
app.use('/', indexRoute);

var loginRoute = require('../web/routes/login');
app.use('/login',loginRoute(passport));

var profileRoute = require('../web/routes/profile');
app.use('/profile', profileRoute);



app.listen(3030, (err) => {
    if(err) console.log(err);

    console.log('listening on 3030');
})