const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Arroba', new Schema({
    username: String,
    favorites : [ { retweeted: Boolean, tweet : {} } ]
}));