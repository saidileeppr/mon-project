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
      if(rooms[roomId]){
        rooms[roomId].push(userId);
      }
      else{
        rooms[roomId] =[userId];
        hosts[roomId] =userId;
      }
      socs[socket.id]=userId;
      users[socket.id]=roomId;
      console.log(rooms);
  });
  socket.on('message',function(op,ranges,texts,roomId,userId){
    if(hosts[roomId]==userId || op==3){
      socket.to(roomId).emit('newMessage',op,ranges,texts,roomId);
      console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+hosts[roomId]);
    }
  });
  socket.on('disconnect',function(){
    rem(users[socket.id],socket.id);
    console.log(rooms);
    console.log('user just disconnected');
  });
  socket.on('radio', function(blob,roomId) {
    socket.to(roomId).emit('voice', blob);
});
});
server.listen(PORT,function(){
  console.log(`Server is up on port ${PORT}`)
});
function rem(roomId1,sock1){
  userId1=socs[sock1];
  if(rooms[roomId1]){
    if(rooms[roomId1].length==1){
      delete hosts[roomId1];
      delete users[sock1];
      delete socs[sock1];
      delete rooms[roomId1];
    }
    else{
      var ind;
      for(i=0;i<rooms[roomId1].length;i++){
        if(rooms[roomId1][i]==userId1){
          ind=i;
          break;
        }
      }
      rooms[roomId1].splice(ind,1);
    }     
  }
}