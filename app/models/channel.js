const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = mongoose.model('Channel', new Schema({
    channel: { type:String, unique: true },
    time: { type: Date, default: Date.now },
    between: Array
})
)