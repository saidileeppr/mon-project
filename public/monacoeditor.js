let socket = io();
var roomId1='';
var userName='';
var rec='';
var arr='';
var arriter=0;
var userId='';
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@latest/min/vs' }});
require(["vs/editor/editor.main"],function () {
  model=monaco.editor.createModel(
  "",
  "python"
);
  monEditor = monaco.editor.create(document.getElementById('myInput'),{
      model,
      theme: "vs-dark"
  });
  monEditor.updateOptions({
    "autoIndent": true,
    "formatOnPaste": true,
    "formatOnType": true
});
});
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
  socket.on('newMessage',function (op,ranges,texts,roomId) {
    realTime(op,ranges,texts,roomId);
  });
  socket.on('prevData',function(roomId){
    roomId1 =roomId;
    console.log('newUser from room:'+roomId);
    require(["vs/editor/editor.main"],function () {
      var con=model.getValue();
      sendData(3,[[1,1,1,1]],[con],roomId);
      });
    });
function sendData(op,ranges,texts,roomId) {
  console.log("send to room:",roomId);
    socket.emit('message',op,ranges,texts,roomId,userId);
}