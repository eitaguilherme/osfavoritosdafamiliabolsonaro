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
    
    const toSaveArrobas = [ { screenname: 'jairbolsonaro', nome: 'Jair Bolsonaro'}, { screenname: 'FlavioBolsonaro', nome: 'Flavio Bolsonaro' }, { screenname: 'CarlosBolsonaro', nome: 'Carlos Bolsonaro' } , { screenname: 'BolsonaroSP', nome: 'Eduardo Bolsonaro' } ];

    Arroba.find({}, (err,arrobas) => {
       if(arrobas.length == 0){
           toSaveArrobas.forEach((arroba) => {
               let a = new Arroba({
                   screenname: arroba.screenname,
                   nome: arroba.nome
               });
   
               a.save((err) => { 
                   if(err) console.log(err)
                   else console.log(`${logName}inseri o ${arroba.nome}`);
               });
           })
       }
    });
};

module.exports = start;