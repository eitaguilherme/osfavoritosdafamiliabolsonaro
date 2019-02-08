const mongoose = require('mongoose');
const databaseConfig = require('./config/database');

 mongoose.connect(databaseConfig.connectionString, (err) => {
     if(err){
        console.log('ocorreu um erro no banco de dados');
        console.log(err);
     }
 });

const arrobas = [ 'jairbolsonaro', 'FlavioBolsonaro', 'CarlosBolsonaro' , 'BolsonaroSP' ];

const Arroba = require('./models/arroba.model');


Arroba.find({}, (err,res) => {
    if(res.length == 0){
        arrobas.forEach((arroba, index) => {
            let a = new Arroba({
                username: arroba
            });
            console.log('inserting arroba ' + a.username);
            a.save((err) => console.log(err));
        });
    }
})
