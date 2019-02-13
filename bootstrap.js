const mongoose = require('mongoose');
const databaseConfig = require('./config/database');

const logName = '[bootstrap] > ';

const Arroba = require('./models/arroba.model');
mongoose.connect(databaseConfig.connectionString, { useNewUrlParser: true } , (err) => {
     if(err){
        console.log('ocorreu um erro no banco de dados');
        console.log(err);
     }
 });

let start = () => {
    
    const toSaveArrobas = [ 'jairbolsonaro', 'FlavioBolsonaro', 'CarlosBolsonaro' , 'BolsonaroSP' ];
    console.log(`${logName}vou inserir as arrobas ${toSaveArrobas.join(' ')}`);

    Arroba.find({}, (err,arrobas) => {
       if(arrobas.length == 0){
           toSaveArrobas.forEach((arroba) => {
               let a = new Arroba({
                   screenname: arroba
               });
   
               a.save((err) => { 
                   if(err) console.log(err)
                   else console.log(`${logName}inseri o ${arroba}`);
               });
           })
       }
    });
};

module.exports = start;