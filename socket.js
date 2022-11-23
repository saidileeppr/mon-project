//Sockets Code
const server= require('./server');
const socketIO = require('socket.io');
const PORT = process.env.PORT ||5123;
var logger= require('./logger');
let io = socketIO(server);
var rooms={};
var socks={};
var users={};
io.on('connection',function(socket){
    logger.info('user just connected');
    socket.on('c2s_newUser',function(roomId,userId,userName){
      socks[socket.id]={};
      socket.join(roomId);
        if(rooms[roomId]){
          //emit to all excpet new user
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
        logger.info("rooms:"+JSON.stringify(rooms));
        logger.info("socks:"+JSON.stringify(socks));
        if(rooms[roomId].tempWrite==userId){
          io.to(socket.id).emit('s2c_writePerm');
        }
        if(rooms[roomId].tempHost==userId){
        io.to(socket.id).emit('s2c_makeHost');.000
        }
    });
    socket.on('c2s_message',function(op,ranges,texts,roomId,userId){
      if(verify(socket.id,userId)){
        if(rooms[roomId].tempWrite==userId){
          //emit to all except current user
          logger.info('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].tempHost);
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
          logger.info('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].tempHost);
        }
      }
    });
    socket.on('disconnect',function(){
      if(socks[socket.id]){
        //emit to all except current user
        socket.to(socks[socket.id].room).emit("s2c_delUser",socks[socket.id].userName,socks[socket.id].userId,rooms[socks[socket.id].room].tempHost);
        rem(socks[socket.id].room,socket.id);
      }
      logger.info(JSON.stringify(rooms));
      logger.info('user just disconnected');
    });
    socket.on('c2s_radio', function(blob,roomId) {
      socket.to(roomId).emit('s2c_voice', blob);
  });
  socket.on('c2s_reqTempWriteAccess', function(userId,roomId) {
    if(socks[socket.id]){
      //emit to existing Host
      logger.info('requestedWrite for'+userId+' in '+roomId);
      io.to(users[rooms[roomId].tempHost]).emit("s2c_askWrite",userId,socks[socket.id].userName);
    }
});
socket.on('c2s_giveWrite', function(userId,roomId) {
  if(socks[socket.id]){
    //emit to existing Write
    logger.info('givenWrite for'+userId+' in '+roomId);
    io.to(users[rooms[roomId].tempWrite]).emit("s2c_removeWrite",userId,socks[socket.id].userName);
    //emit to new Writer
    io.to(users[userId]).emit('s2c_writePerm');
    rooms[roomId].tempWrite =userId;
  }
});
socket.on('c2s_rejectWrite', function(userId,roomId) {
  if(socks[socket.id]){
    //emit to existing Host
    logger.info('rejectedWrite for'+userId+' in '+roomId);
    io.to(users[userId]).emit("s2c_writeRejected");
  }
});
  });

    function rem(roomId1,sock1){
    var userId1=socks[sock1].userId;
    var userName1=socks[sock1].userName;
    if(rooms[roomId1]){
      if(rooms[roomId1].ids.length==1){
        delete socks[sock1];
        delete rooms[roomId1];
        delete users[userId1];
      }
      else{
        var ind;
        ind =rooms[roomId1].ids.indexOf(userId1);
        rooms[roomId1].ids.splice(ind,1);
        ind=rooms[roomId1].names.indexOf(userName1);
        rooms[roomId1].names.splice(ind,1);
        delete socks[sock1];
      }     
    }
    else{
      logger.info("Error with room:"+roomId1);
    }
  }

function verify(socId,userId1){
    if(socks[socId] && socks[socId].userId==userId1){
      return true;
    }
    return false;
  }