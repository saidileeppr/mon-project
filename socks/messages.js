var logger = require('../logger');
const {roomService,userRoomService,userService}=require('../api/services');
const messages = async function (socket,io) {
  socket.on('c2s_pastMessage',async function(op,ranges,texts,roomId,userId,socid){
      var host=await roomService.getHost(roomId);
      if(host==userId || op==3){
        //emit to new user
        io.to(socid).emit('s2c_newMessage',op,ranges,texts,roomId);
        logger.info('Message from:'+userId+"   To room:"+roomId+"   Host:"+host);
      }
    
  });
  socket.on('c2s_message', function (op, ranges, texts, roomId, userId) {
    //emit to all except current user        logger.info('Message from:'+userId+"   To room:"+roomId+"   Host:"+rooms[roomId].tempHost);
    socket.to(roomId).emit('s2c_newMessage', op, ranges, texts, roomId);
  });
  socket.on('c2s_reqRepName', function (old_name, new_name, userId, roomId) {
    socket.to(roomId).emit('s2c_repName', old_name, new_name, userId);
  });
  socket.on('c2s_radio', function(blob,roomId) {
    socket.to(roomId).emit('s2c_voice', blob);
  });

};
module.exports = messages ;