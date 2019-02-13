const mongoose = require('mongoose');
const Twit = require('twit');
const dotenv = require('dotenv');
dotenv.config();

const Arroba = require('./models/arroba.model')

const configTwitter = require('./config/twitter');
const configDatabase = require('./config/database');

let logName = `[read-and-retweet-favorite-tweets] > [${new Date().toLocaleTimeString()}] > `;
let start = (options) => {
    // console.log(`${logName}iniciando os trabalhos`)

    const context = {
        screenname: options.screenname,
        arroba : options.arroba
    };

    // logName += `[@${context.screenname}] > `;
    
    let fetchTweetsAndRetweet = (context) => {
        return new Promise((resolve,reject) => {
            console.log(`${logName}buscando os tweets favoritos do ${context.arroba.screenname}`);

            let T = new Twit({
                consumer_key:         options.consumerKey,
                consumer_secret:      options.consumerSecret,
                access_token:         options.accessToken,
                access_token_secret:  options.accessTokenSecret
            });
            
            T.get('favorites/list', { count: 30, screen_name: context.arroba.screenname }, (err, tweets) =>{
                if(err) reject(err);
                else{
                    console.log(`${logName}retornou da api com ${tweets.length}`);

                    if(context.arroba.favorites){
                        let ids = tweets.map((tweet) => tweet.id_str);
                        let tweetsToSaveAndRetweet = ids.filter((id) => {
                            return !(context.arroba.favorites.filter((savedTweet) => savedTweet.tweet == id ).length > 0)
                        });
                        tweetsToSaveAndRetweet = tweetsToSaveAndRetweet.reverse();


                        if(tweetsToSaveAndRetweet.length > 0){
                            console.log(`${logName}tweets para salvar e/ou retuitar ${tweetsToSaveAndRetweet.length} do @${context.arroba.screenname}`);

                            Arroba.updateOne(
                                { screenname: context.arroba.screenname },
                                { $set: { favorites: tweetsToSaveAndRetweet.map((tweetToSave) => {
                                    return { retweeted: true, tweet: tweetToSave };
                                })}},
                                (err) => {
                                    if(err){
                                        console.log(`${logName}occorreu um erro ao atualizar`);
                                        console.log(`${err}`);
                                    }
                                }
                            );

                            let promises = [];
                            tweetsToSaveAndRetweet.forEach(tweetToRetweet => {
                                promises = T.post('statuses/retweet/' + tweet, (err) => {
                                    if(err) console.log(tweet + ": " + err.message);
                                    else console.log('retuitado o id ' + tweet);
                                }).then(() => console.log('retuitado'));
                            });
                            Promise.all(promises)
                                .then(() => resolve());

                            // resolve();
                        }else{
                            console.log(`${logName}não tem nada pra fazer aqui, o @${context.arroba.screenname} não favoritou nada por enquanto`);
                            resolve();
                        }

                    }
                }
            });
        })
    };

    return Promise.resolve(context)
        .then(fetchTweetsAndRetweet);
};

module.exports = start;