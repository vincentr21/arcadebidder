// Javascript core modules
var path = require('path');

// Javascript network and server modules
var express = require('express') 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Project Game modules
var arcadeBidder = require('./arcadeBidder');


// ===================================================================================

app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
    // res.send("Hello Game!!")
});

io.on('connection', function(socket){
    console.log('A client connected!!')
    arcadeBidder.initGame(io, socket);
});


http.listen(2000, function(){
    console.log('Started server, listening on *:2000');
});
