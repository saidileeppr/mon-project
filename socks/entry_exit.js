var logger = require('../logger');
const {roomService,userRoomService,userService}=require('../api/services');
const entry_exit = function (socket,io) {
    socket.on('c2s_newUser',async function(roomId,userId,username){
      logger.info(userId+ " trying create/join  "+roomId);
        roomstat=await roomService.createRoom(roomId,userId)//New Room Creation,User is Host as this is new room
        if(roomstat==1){
            userstat=await userRoomService.createUserRoom(userId,socket.id,roomId,username);
            if(userstat==1){
              logger.info(userId+ " created  "+roomId);
                socket.join(roomId);
            }
            else if(userstat==11000){
              //User already present in another room
              var userRoom=await userRoomService.getUserRoom(userId);
              logger.info(userId+ " cannot create "+roomId +".Altready present in "+userRoom);
                
            }
            else{
                //Error Occured
                logger.error("Error Occured while"+ userId+" creating "+ roomId);
            }
        }
        else if(roomstat==11000){//Room already Created
            userstat=await userRoomService.createUserRoom(userId,socket.id,roomId,username);
            if(userstat==1){
              var roomHostWriter = await roomService.getHostWriter(roomId);
              var userRoomData=await userRoomService.getMembersDetails(roomId);
                logger.info(userId+ " joined  "+roomId);
                socket.join(roomId);
                socket.to(roomId).emit('s2c_prevData',socket.id,roomId);
                socket.to(roomId).emit('s2c_addUser',username,userId,roomHostWriter.host);
                //emit to new user
                io.to(socket.id).emit("s2c_addUsers",userRoomData,roomHostWriter.host);
            }
            else if(userstat==11000){
                //User already present in another room
                var userRoom=await userRoomService.getUserRoom(userId);
                logger.info(userId+ " cannot join "+roomId +".Altready present in "+userRoom);
            }
            else{
                //Error Occured
                logger.error("Error Occured while"+ userId+" joining "+ roomId);
            }
        }
        else{
            //Error Occured
            logger.error("Error Occured while changing "+ roomId);
        }
        roomHostWriter = await roomService.getHostWriter(roomId);
        if(roomHostWriter.host==userId){
          io.to(socket.id).emit('s2c_makeHost');
        }
        if(roomHostWriter.writer==userId){
          io.to(socket.id).emit('s2c_writePerm');
        }
      });
      socket.on('disconnect',async function(){
          //emit to all except current user
          var userRoomData=await userRoomService.getUserRoom(socket.id);
          var roomHost=await roomService.getHost(userRoomData.roomId);
          socket.to(userRoomData.roomId).emit("s2c_delUser",userRoomData.username,userRoomData.userId,roomHost.host);
          logger.info(userRoomData.userId+" disconnected from "+ userRoomData.roomId);
          var delUser=await userRoomService.delUserRoom(userRoomData.userId);
          if(delUser.deletedCount== 1){
            var count = await userRoomService.getMembers(userRoomData.roomId);
          if(count.length==0){
            logger.info("Deleting room: "+userRoomData.roomId);
            await roomService.delRoom(userRoomData.roomId);
          }
          }
          else{
            logger.log("Error in deleting userRoom Data of "+userRoomData.userId);
          }
          
      });
}
module.exports = entry_exit;