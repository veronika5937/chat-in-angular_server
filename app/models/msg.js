const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg: { type: String, required: true },
    user: { type: Object, required: true },
    time:  { type: Date, default: Date.now },
})
)
