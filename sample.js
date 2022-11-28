const {userRoomService,roomService,userService}=require('./api/services');
async function c(){
console.log(await roomService.getHost('abcd'));
}
c();