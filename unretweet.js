const mongoose = require('mongoose');
const Twit = require('twit');
const dotenv = require('dotenv');
dotenv.config();

const Arroba = require('./models/arroba.model')

const configTwitter = require('./config/twitter');
const configDatabase = require('./config/database');

let logName = `[unretweet] > [${new Date().toLocaleTimeString()}] > `;


 let start = (options) => {
    return new Promise((resolve,reject) => {
        console.log(`${logName}começando a limpar essa merda toda`);

        let T = new Twit({
            consumer_key:         options.consumerKey,
            consumer_secret:      options.consumerSecret,
            access_token:         options.accessToken,
            access_token_secret:  options.accessTokenSecret
        });

        Arroba.find({} ,(err,arrobas) => {
            let promises = [];

            arrobas.forEach((arroba) => {
                if(arroba.favorites){
                    arroba.favorites.forEach((tweet) => {
                        T.post('statuses/unretweet/' + tweet, (err) => {
                            if(err) console.log(tweet + ": " + err.message);
                            else console.log('tirnado o id ' + tweet);
                        }).then(() => console.log('retuitado'));
                    })
                }
            });
            
             Promise.all(promises)
                .then(() => {
                    console.log(`${logName}fim dessa merda toda`);
                    reject();
                })
                .then(() => resolve());

            //     .catch(() => {
            //         console.log(`${logName}deu ruim`);
            //         reject();
            //     });
        });
    });
 }
module.exports = start;

