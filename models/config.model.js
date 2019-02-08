const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('config', new Schema({
    accessTokenSecret: String,
    accessToken: String,
    screenname: String
}));