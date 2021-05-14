const path = require('path');
const http = require('http');
const express = require('express');
const PORT = process.env.PORT ||80;
const socketIO = require('socket.io');
const cors = require('cors');
var app = express();
let server = http.createServer(app);
let io = socketIO(server);
var rooms={};
var hosts={};
var socs={};
var users={};
app.use(cors());
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,rep){
  rep.sendFile(__dirname+"/public/index.html")
})
app.get('/:editor_room',function(req,rep){
  rep.sendFile(__dirname+"/public/monaco_room.html")
})
io.on('connection',function(socket){
  console.log('user just connected');
  socket.on('newUser',function(roomId,userId){
    userId1=userId;
    socket.join(roomId);
    socket.to(roomId).emit('prevData',roomId);
  });
  socket.on('message',function(range,text,roomId,userId){
    console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+hosts[roomId]);
    //if(hosts[roomId]==userId || opt=='P')
      socket.to(roomId).emit('newMessage',range,text,roomId);
  });
  socket.on('disconnect',function(){
    console.log('user just disconnected');
  });
  socket.on('radio', function(blob,roomId) {
    socket.to(roomId).emit('voice', blob);
});
});
server.listen(PORT,function(){
  console.log(`Server is up on port ${PORT}`)
});