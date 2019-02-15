const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Arroba', new Schema({
    screenname: String,
    nome: String,
    favorites : [ { retweeted: Boolean, tweet : {} } ]
}));