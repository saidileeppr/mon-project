let socket = io();
var roomId1='';
var userName='';
var rec='';
var arr='';
var arriter=0;
var userId='';
var host=0;
var userName;
var roomNames=[];
var roomIds=[];
var langg=document.getElementById("langg");
var audFile;
var memList=document.getElementById("members");
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' }});
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
    "formatOnType": true,
    "readOnly": true
});
});
  socket.on('connect',function(){
    console.log('connected to server');
    roomId1=window.location.href;
    roomId1=roomId1.replace(/http:\/\/.*\//i,'');
    roomId1=roomId1.replace(/https:\/\/.*\//i,'');
    if(localStorage.getItem('userName')===null){
      userName=prompt("Your  name?");
      localStorage.setItem('userName',userName);
    }
    else{
      userName=localStorage.getItem('userName');
    }
    if(localStorage.getItem('userId')===null){
      localStorage.setItem('userId',generateId(9));
      userId = localStorage.getItem('userId');
    }
    else{
      userId=localStorage.getItem('userId');
    }
    if(roomId1){
      socket.emit('newUser',roomId1,userId,userName);
    }
  });
  socket.on("addUsers",function(userNames,userIds){
    roomNames=userNames;
    roomIds=userIds;
    console.log("Room Members",roomNames);
    for (i=0;i<roomNames.length;i++){
      memList.innerHTML+="<div id=\""+roomIds[i]+"\">"+roomNames[i]+"</div>";
    }
  });
  socket.on("addUser",function(userName,userId){
    roomIds.push(userId);
    roomNames.push(userName);
    console.log("Room Members",roomNames);
    memList.innerHTML+="<div id=\""+userId+"\">"+userName+"</div>";
  });
  socket.on("delUser",function(userName1,userId1){
    var ind;
    ind=roomNames.indexOf(userName1);
    roomNames.splice(ind,1);
    ind=roomIds.indexOf(userId1);
    roomIds.splice(ind,1);
    console.log("Room Members",roomNames);
    console.log("<div id=\""+userId1+"\">"+userName1+"</div>",memList.innerHTML);
    memList.innerHTML=memList.innerHTML.replace("<div id=\""+userId1+"\">"+userName1+"</div>","");
  });
  socket.on('writePerm',function(){
    console.log('Host');
    host=1;
    require(["vs/editor/editor.main"],function () {
      monEditor.updateOptions({
        "readOnly": false
    });
    });
  });
  socket.on('disconnect',function (){
    console.log('disconnected from server');
  });
  socket.on('newMessage',function (op,ranges,texts,roomId) {
    realTime(op,ranges,texts,roomId);
  });
  socket.on('prevData',function(socid,roomId){
    roomId1 =roomId;
    console.log('newUser from room:'+roomId);
    require(["vs/editor/editor.main"],function () {
      var con=model.getValue();
      sendNewData(3,[[1,1,1,1]],[con],roomId,socid);
      });
    });
function sendNewData(op,ranges,texts,roomId,socid) {
  console.log("send to room:",roomId);
  socket.emit('pastMessage',op,ranges,texts,roomId,userId,socid);
}
function sendData(op,ranges,texts,roomId) {
  console.log("send to room:",roomId);
    socket.emit('message',op,ranges,texts,roomId,userId);
}
function generateId(len){
  var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-+=;:[]{}!@#$^*()`~';
  var rtn = '';
  for(var i=0;i<len;i++){
      rtn += ALPHABET.charAt(Math.floor(Math.random()*ALPHABET.length));
    }
  return rtn;
}
langg.onchange=function(){
  require(["vs/editor/editor.main"],function () {
    monaco.editor.setModelLanguage(model,langg.value);
    console.log(langg.value);
  });
};