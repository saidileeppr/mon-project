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
  socket.on('newUser',function(roomId,userId,userName){
    userId1=userId;
    users[socket.id]={};
    socket.join(roomId);
      if(rooms[roomId]){
        socket.to(roomId).emit('prevData',socket.id,roomId);
        socket.to(roomId).emit('addUser',userName,userId,rooms[roomId].host);
        io.to(socket.id).emit("addUsers",rooms[roomId].names,rooms[roomId].ids,rooms[roomId].host);
        rooms[roomId].ids.push(userId);
        rooms[roomId].names.push(userName);
      }
      else{
        rooms[roomId]={};
        rooms[roomId].ids =[userId];
        rooms[roomId].host =userId;
        rooms[roomId].write =userId;
        rooms[roomId].names=[userName];

      }
      users[socket.id].userId=userId;
      users[socket.id].room=roomId;
      users[socket.id].userName=userName;
      console.log(rooms);
  });
  socket.on('message',function(op,ranges,texts,roomId,userId){
    if(rooms[roomId].host==userId){
      socket.to(roomId).emit('newMessage',op,ranges,texts,roomId);
      console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].host);
    }
  });
  socket.on('reqRepName',function(old_name,new_name,roomId){
    socket.to(roomId).emit('repName',old_name,new_name);
  });
  socket.on('pastMessage',function(op,ranges,texts,roomId,userId,socid){
    if(rooms[roomId].host==userId || op==3){
      io.to(socid).emit('newMessage',op,ranges,texts,roomId);
      console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].host);
    }
  });
  socket.on('disconnect',function(){
    if(users[socket.id]){
      socket.to(users[socket.id].room).emit("delUser",users[socket.id].userName,users[socket.id].userId,rooms[users[socket.id].room].host);
      rem(users[socket.id].room,socket.id);
    }
    console.log(rooms);
    console.log('user just disconnected');
  });
  socket.on('radio', function(blob,roomId) {
    //socket.to(roomId).emit('voice', blob);
});
});
server.listen(PORT,function(){
  console.log(`Server is up on port ${PORT}`)
});
function rem(roomId1,sock1){
  var userId1=users[sock1].userId;
  var userName1=users[sock1].userName;
  if(rooms[roomId1]){
    if(rooms[roomId1].ids.length==1){
      delete users[sock1];
      delete rooms[roomId1];
    }
    else{
      var ind;
      ind =rooms[roomId1].ids.indexOf(userId1);
      rooms[roomId1].ids.splice(ind,1);
      ind=rooms[roomId1].names.indexOf(userName1);
      rooms[roomId1].names.splice(ind,1);
      delete users[sock1];
    }     
  }
}
