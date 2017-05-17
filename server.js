const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes.js');
const cors = require('cors');

const http = require('http').createServer(app);
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const socketioJwt = require('socketio-jwt');

const config = require('./config.json');
const mongoConnected = require('./db.js');

var User = require('./app/models/user');
var Message = require('./app/models/msg');
var Channel = require('./app/models/channel');


app.use(express.static('public')); //Для обробки статичних файлів, таких як зображення, CSS файли, та JavaScript файли
app.use(cors()); // Enable All CORS Requests

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(routes);

io.sockets
  .on('connection', socketioJwt.authorize({
    secret: config.jwt_secret,
    callback: false
  }))
  .on('authenticated', socket => {
    io.emit('join', {
      user: socket.decoded_token,
      time: Date.now()
    })
    socket
      .on('unauthorized', unauthorizedHandler)
      .on('message', MessageHandler)
      .on('disconnect', disconnectHandler);


    function unauthorizedHandler(error) {
      if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
        console.log("User's token has expired");
      }
    }

// hendling messages
    function MessageHandler(msg) {

      const msgObj = new Message({
        msg,
        user: socket.decoded_token,
        time: Date.now()
      })

      
       msgObj.save( err =>{
        if (err) console.log(err)
        io.emit('message', msgObj);
       })

    }

//leave chat
   function disconnectHandler() {
      io.emit('leave', {
        user: socket.decoded_token,
        time: Date.now()
      })
    }


 });









const server_port = process.env.PORT || 8000;
const server_ip_address = process.env.IP || 'localhost';





const server = http.listen(server_port, server_ip_address, () => {
  console.log(`Auth servise running on http://${server_ip_address}:${server_port}`)
})