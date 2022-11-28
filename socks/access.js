var logger = require('../logger');
const {roomService,userRoomService,userService}=require('../api/services');
const access = function (socket,io) {
  socket.on('c2s_reqTempWriteAccess',async  function (userId, roomId) {
      //emit to existing Host
      logger.info('requestedWrite for' + userId + ' in ' + roomId);
      roomHost=await roomService.getHost(roomId);
      hostSocket = await userRoomService.getSocketId(roomHost);
      io.to(hostSocket).emit("s2c_askWrite", userId, socks[socket.id].userName);
    
  });
  socket.on('c2s_giveWrite', async function (userId, roomId) {
      //emit to existing Write
      logger.info('givenWrite for' + userId + ' in ' + roomId);
      roomWriter=await roomService.getHost(writer);
      writerSocket = await userRoomService.getSocketId(roomWriter);
      userSocket =await  userRoomService.getSocketId(userId);
      io.to(userSocket).emit("s2c_removeWrite");
      //emit to new Writer
      io.to(writerSocket).emit('s2c_writePerm');
      rooms[roomId].tempWrite = userId;
    
  });
  socket.on('c2s_rejectWrite',async function (userId, roomId) {
      //emit to existing Host
      userSocket = await userRoomService.getSocketId(userId);
      io.to(userSocket).emit("s2c_writeRejected");
      logger.info('rejectedWrite for' + userId + ' in ' + roomId);
  });
};
module.exports = access ;