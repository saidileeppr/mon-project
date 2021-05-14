let socket = io();
var roomId1='';
var userName='';
var rec='';
var arr='';
var arriter=0;
var userId='';
  socket.on('connect',function(){
    console.log('connected to server');
     roomId1=window.location.href;
    roomId1=roomId1.replace(/http:\/\/.*\//i,'');
    roomId1=roomId1.replace(/https:\/\/.*\//i,'');
    //userName=prompt("Your  name?");
    if(localStorage.getItem('userId')===null){
      localStorage.setItem('userId',socket.id);
      userId = localStorage.getItem('userId');
    }
    else{
      userId=localStorage.getItem('userId');
    }
    socket.emit('newUser',roomId1,userId);
  });
  socket.on('disconnect',function (){
    console.log('disconnected from server');
    socket.emit('discUser',roomId1,userId);
  });
  socket.on('newMessage',function (range,text,roomId) {
    realTime(range,text,roomId);
  });
  socket.on('prevData',function(roomId){
    roomId1 =roomId;
    console.log('newUser from room:'+roomId);
    sendData([0,0,0,0],"",roomId1);
  });
function sendData(range,text,roomId) {
  console.log("send to room:",roomId);
    socket.emit('message',range,text,roomId,userId);
}