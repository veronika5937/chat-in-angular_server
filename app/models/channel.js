const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Channel', new Schema({
    name: { type: String, unique: true },
    id: String,
    private: Boolean,
    between: Array
})
)