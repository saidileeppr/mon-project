//Sockets Code
const socketIO = require('socket.io');
let rooms={};
let socks={};
let users={};
exports.startApp=async function (server){
  const io = socketIO(server);
io.on('connection',function(socket){
    console.log('user just connected');
    socket.on('c2s_newUser',function(roomId,userId,userName){
      socks[socket.id]={};
      socket.join(roomId);
        if(rooms[roomId]){
          //emit to all except new user
          socket.to(roomId).emit('s2c_prevData',socket.id,roomId);
          socket.to(roomId).emit('s2c_addUser',userName,userId,rooms[roomId].tempHost);
          //emit to new user
          io.to(socket.id).emit("s2c_addUsers",rooms[roomId].names,rooms[roomId].ids,rooms[roomId].tempHost);
          rooms[roomId].ids.push(userId);
          rooms[roomId].names.push(userName);
        }
        else{
          rooms[roomId]={};
          rooms[roomId].ids =[userId];
          rooms[roomId].owner=userId;
          rooms[roomId].tempHost =userId;
          rooms[roomId].tempWrite =userId;
          rooms[roomId].names=[userName];
        }
        socks[socket.id].userId=userId;
        socks[socket.id].room=roomId;
        socks[socket.id].userName=userName;
        users[userId]=socket.id;
        console.log("rooms:"+JSON.stringify(rooms));
        console.log("socks:"+JSON.stringify(socks));
        if(rooms[roomId].tempWrite==userId){
          io.to(socket.id).emit('s2c_writePerm');
        }
        if(rooms[roomId].tempHost==userId){
        io.to(socket.id).emit('s2c_makeHost');
        }
    });
    socket.on('c2s_message',function(op,ranges,texts,roomId,userId){
      if(verify(socket.id,userId)){
        if(rooms[roomId].tempWrite==userId){
          //emit to all except current user
          console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].tempHost);
          socket.to(roomId).emit('s2c_newMessage',op,ranges,texts,roomId);
        }
      }
    });
    socket.on('c2s_reqRepName',function(old_name,new_name,userId,roomId){
        if(verify(socket.id,userId)){
        //emit to all except current user
        socket.to(roomId).emit('s2c_repName',old_name,new_name,userId);
        }
    });
    socket.on('c2s_pastMessage',function(op,ranges,texts,roomId,userId,socid){
      if(verify(socket.id,userId)){
        if(rooms[roomId].tempHost==userId || op==3){
          //emit to new user
          io.to(socid).emit('s2c_newMessage',op,ranges,texts,roomId);
          console.log('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].tempHost);
        }
      }
    });
    socket.on('disconnect',function(){
      if(socks[socket.id]){
        //emit to all except current user
        socket.to(socks[socket.id].room).emit("s2c_delUser",socks[socket.id].userName,socks[socket.id].userId,rooms[socks[socket.id].room].tempHost);
        rem(socks[socket.id].room,socket.id);
      }
      console.log(JSON.stringify(rooms));
      console.log('user just disconnected');
    });
    socket.on('c2s_radio', function(blob,roomId) {
      socket.to(roomId).emit('s2c_voice', blob);
  });
  socket.on('c2s_reqTempWriteAccess', function(userId,roomId) {
    if(socks[socket.id]){
      //emit to existing Host
      console.log('requestedWrite for'+userId+' in '+roomId);
      io.to(users[rooms[roomId].tempHost]).emit("s2c_askWrite",userId,socks[socket.id].userName);
    }
});
socket.on('c2s_giveWrite', function(userId,roomId) {
  if(socks[socket.id]){
    //emit to existing Write
    console.log('givenWrite for'+userId+' in '+roomId);
    io.to(users[rooms[roomId].tempWrite]).emit("s2c_removeWrite",userId,socks[socket.id].userName);
    //emit to new Writer
    io.to(users[userId]).emit('s2c_writePerm');
    rooms[roomId].tempWrite =userId;
  }
});
socket.on('c2s_rejectWrite', function(userId,roomId) {
  if(socks[socket.id]){
    //emit to existing Host
    console.log('rejectedWrite for'+userId+' in '+roomId);
    io.to(users[userId]).emit("s2c_writeRejected");
  }
});
  });
}
    function rem(roomId1,sock1){
    let userId1=socks[sock1].userId;
    let userName1=socks[sock1].userName;
    if(rooms[roomId1]){
      if(rooms[roomId1].ids.length==1){
        delete socks[sock1];
        delete rooms[roomId1];
        delete users[userId1];
      }
      else{
        let ind;
        ind =rooms[roomId1].ids.indexOf(userId1);
        rooms[roomId1].ids.splice(ind,1);
        ind=rooms[roomId1].names.indexOf(userName1);
        rooms[roomId1].names.splice(ind,1);
        delete socks[sock1];
      }     
    }
    else{
      console.log("Error with room:"+roomId1);
    }
  }

function verify(socId,userId1){
    return !!(socks[socId] && socks[socId].userId==userId1);
  }