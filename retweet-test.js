const Twit = require('twit');

let T = new Twit({
    consumer_key:         "MUYMQmQMhRDBXLzPtQ",
    consumer_secret:      "sHG5ZtCMTe8JscVtcjWje18ljAgAvgYnuFsfcMlUc",
    access_token:         "1093877527150510081-L1byCVEP8Cm6XJuD9hQDbHxUCtiWtZ",
    access_token_secret:  "OEcNhnlyPsx09UPZ55RZBbynwNoUC6jQBaOxiRH71zyYf"
});

T.post('statuses/update', { status: 'Jair Retuitou isso aqui', attachment_url: decodeURI('https://twitter.com/fmzguilherme/status/1096361772309725184') } ,(err) => {
      if(err) console.log(err);
  })
  
T.post('statuses/update', { status: 'Jair favoritou isso aqui', attachment_url: decodeURI('https://twitter.com/fmzguilherme/status/1096086693126512641') } ,(err) => {
        if(err) console.log(err);
}).then(() => console.log('status ok'));