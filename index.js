const mongoose = require('mongoose');
const Twit = require('twit');

const dotenv = require('dotenv');
dotenv.config();

const databaseConfig = require('./config/database');
mongoose.connect(databaseConfig.connectionString, (err) => {
    if(err){
       console.log('ocorreu um erro no banco de dados');
       console.log(err);
       process.exit(1);
    }
});

const consumerKey = process.env.CONSUMER_KEY, consumerSecret = process.env.CONSUMER_SECRET;
if(!consumerKey || !consumerSecret){
        console.log("falta chave");
        process.exit(1);
}

const Arroba = require('./models/arroba.model');
const Config = require('./models/config.model');

Config.findOne( { screenname: 'BolsonarosFavs' })
    .then((config) => {
        let T = new Twit({
            consumer_key:         consumerKey,
            consumer_secret:      consumerSecret,
            access_token:         config.accessToken,
            access_token_secret:  config.accessTokenSecret
        });

        Arroba.find({}).then((arrobas) => {
                arrobas.forEach((arroba, index) => {

                    let tweetsSaved = [];  
                    if(arroba.favorites)  
                        tweetsSaved = arroba.favorites.map((favorite) => favorite.tweet.id_str);
                    
                    T.get('favorites/list', { count: 30, screen_name: arroba.username }, (err, tweets) => {
                        let tweetsToSaveAndRetweet = tweets.filter((tweets) => {
                             return !(tweetsSaved.filter((savedId) => savedId == tweets.id_str ).length > 0)
                         });
                        tweetsToSaveAndRetweet = tweetsToSaveAndRetweet.reverse();
                        tweetsToSaveAndRetweet = tweetsToSaveAndRetweet.map((tweet) => {
                            return {
                                retweeted: false,
                                tweet: tweet
                            };
                        });

                        tweetsToSaveAndRetweet.forEach((tweetToSave, index) => {
                            Arroba.updateOne({ _id: arroba._id }, {
                                $push: { favorites: tweetToSave }
                            }, (err) => {
                                if(err) console.log(err);
                            });
                        });
                    });
                });
        });
    });
