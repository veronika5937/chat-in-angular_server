const mongoose = require('mongoose');
var config = require('./config');

mongoose.Promise = global.Promise; // add because error in console( (node:4120) DeprecationWarning: Mongoose: mpromise (mongoose's default promise librar
// y) is deprecated, plug in your own promise library instead: http://mongoosejs.com/doc
// s/promises.html)



mongoose.connect(config.mongodb_url, (err)=>{
   if(err) console.log(error);
   console.log("Connected correctly to server");
});
