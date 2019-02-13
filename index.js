const Twit = require('twit');
const dotenv = require('dotenv');
const Config = require('./models/config.model');

const logName = `[index] > [${new Date().toLocaleTimeString()}] > `;
console.log(`${logName}iniciando os trabalhos`);

dotenv.config();
const consumerKey = process.env.CONSUMER_KEY, consumerSecret = process.env.CONSUMER_SECRET;

const readAndRetweetFavoriteTweets = require('./read-and-retweet-favorite-tweets');
const boostrap = require('./bootstrap');

let readConfiguration = () => {
    return new Promise((resolve,reject) => {
        Config.findOne({ screenname: process.env.TWITTER })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
};

let startEngine = () => {
    console.log(`${logName}verificando se está tudo ok para começar a funcionar`)

    const databaseConfig = require('./config/database');
    const mongoose = require('mongoose');
    mongoose.connect(databaseConfig.connectionString, { useNewUrlParser: true },(err) => { 
        if(err) {
            console.log(err);
            process.exit(1);
        };
     });

    
    if(!consumerKey || !consumerSecret){
            console.log(`${logName} falta chave da api do twitter`);
            process.exit(1);
    }
}

const Arroba = require('./models/arroba.model');
let getArrobas = () => {
    console.log(`${logName}buscando no banco as arrobas salvas` );
    return new Promise((resolve,reject) => {
        Arroba.find({} ,(err,arrobas) => {
            if(err) reject(err);
            else resolve(arrobas);
        });
    });
}

let doWork = (config) => {
    let options = {
        accessToken: config.accessToken,
        accessTokenSecret: config.accessTokenSecret,
        consumerKey: consumerKey,
        consumerSecret: consumerSecret,
        arroba : {}
    };

    getArrobas()
        .then((results) => {
            if(results.length == 0){
                console.log(`${logName}inserindo umas arrobas aqui porque está sem nada....`)
                boostrap();
            }

            let promises = [];
            results.forEach(arroba => {
                if(arroba.favorites){
                     savedIds = arroba.favorites.map((favorite) => favorite.tweet);
                     console.log(`${logName} @${arroba.screenname} tem ${savedIds.length} favoritos salvos`);
                }
                options.arroba = arroba;
                promises.push(readAndRetweetFavoriteTweets(options));
            });

            Promise.all(promises)
                .then((results) => {
                    results.forEach((result) => {
                        console.log(`${logName} fim do processo`);
                    })
                });
        });
}

startEngine();
readConfiguration()
    .then((config => {
        console.log(`${logName}tá tudo ok e já tenho as configurações, agora é hora de ir ver quem eu vou buscar`);
        doWork(config);
    }));