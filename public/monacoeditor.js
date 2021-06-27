let socket = io();
var loc_roomId1='';
var loc_userName='';
var rec='';
var arr='';
var arriter=0;
var loc_userId='';
var host=0;
var roomdet={userId:[]};
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
    loc_roomId1=window.location.href;
    loc_roomId1=loc_roomId1.replace(/http:\/\/.*\//i,'');
    loc_roomId1=loc_roomId1.replace(/https:\/\/.*\//i,'');
    if(localStorage.getItem('userName')===null){
      loc_userName=prompt("Your  name?");
      localStorage.setItem('userName',loc_userName);
    }
    else{
      loc_userName=localStorage.getItem('userName');
    }
    if(localStorage.getItem('userId')===null){
      localStorage.setItem('userId',generateId(9));
      loc_userId = localStorage.getItem('userId');
    }
    else{
      loc_userId=localStorage.getItem('userId');
    }
    if(loc_roomId1!=""){
      socket.emit('newUser',loc_roomId1,loc_userId,loc_userName);
      memList.innerHTML+="<div>"+loc_userName+"</div>";
      memList.innerHTML+="<button id=\"changeName\" onclick=changeName()>Change Name</button>";
      memList.innerHTML+="<div>Members</div>";
    }
  });
  socket.on("addUsers",function(userNames,userIds,hostId){

    if(hostId==loc_userId){
      memList.innerHTML=memList.innerHTML.replace("<div>"+loc_userName+"</div>","<div>"+loc_userName+" (Host)</div>");
      host=1;
      for (i=0;i<userNames.length;i++){
        roomdet[host]=hostId;
        if(userIds[i]==hostId && userIds[i]!=loc_userId){
          memList.innerHTML=memList.innerHTML.replace("<div>Members</div>","<div>Members</div>"+"<div>"+userNames[i]+" (Host)<button id=\""+userIds[i]+"\" class=\"Mute_But\" onclick=\"muteFun(this.id)\">Mute</button><button id=\""+userIds[i]+"\" class=\"Write_But\" onclick=\"writeFun(this.id)\">Write</button><button id=\""+userIds[i]+"\" class=\"Exit_But\" onclick=\"exitFun(this.id)\">Exit</button></div>");
        }
        else{
          memList.innerHTML+="<div>"+userNames[i]+"<button id=\""+userIds[i]+"\" class=\"Mute_But\" onclick=\"muteFun(this.id)\">Mute</button><button id=\""+userIds[i]+"\" class=\"Write_But\" onclick=\"writeFun(this.id)\">Write</button><button id=\""+userIds[i]+"\" class=\"Exit_But\" onclick=\"exitFun(this.id)\">Exit</button></div>";
        }
      }
    }
    else{
      for (i=0;i<userNames.length;i++){
        roomdet[host]=hostId;
        if(userIds[i]==hostId && userIds[i]!=loc_userId){
          memList.innerHTML=memList.innerHTML.replace("<div>Members</div>","<div>Members</div>"+"<div>"+userNames[i]+" (Host)</div>");
        }
        else{ 
          memList.innerHTML+="<div>"+userNames[i]+"</div>";
        }
      }
    }
  });
  socket.on("addUser",function(userName,userId,hostId){
    roomdet[host]=hostId;
    if(loc_userId==hostId){
      host=1;
      memList.innerHTML+="<div>"+userName+"<button id=\""+userId+"\" class=\"Mute_But\" onclick=\"muteFun(this.id)\">Mute</button><button id=\""+userId+"\" class=\"Write_But\" onclick=\"writeFun(this.id)\">Write</button><button id=\""+userId+"\" class=\"Exit_But\" onclick=\"exitFun(this.id)\">Exit</button></div>";
    }
    else{
      if(userId==hostId && userId!=loc_userId){
        memList.innerHTML=memList.innerHTML.replace("<div>Members</div>","<div>Members</div>"+"<div id=\""+userId+"\">"+userName+" (Host)</div>");
      }
      else{
        memList.innerHTML+="<div>"+userName+"</div>";
      }
    }
  });
  socket.on("delUser",function(userName1,userId1,hostId){
    if(hostId==loc_userId){
        memList.innerHTML=memList.innerHTML.replace("<div>"+userName1+"<button id=\""+userId1+"\" class=\"Mute_But\" onclick=\"muteFun(this.id)\">Mute</button><button id=\""+userId1+"\" class=\"Write_But\" onclick=\"writeFun(this.id)\">Write</button><button id=\""+userId1+"\" class=\"Exit_But\" onclick=\"exitFun(this.id)\">Exit</button></div>","");
    }
    else{
      if(userId1==hostId){
        memList.innerHTML=memList.innerHTML.replace("<div>"+userName1+" (Host)</div>","");
      }
      else{
        memList.innerHTML=memList.innerHTML.replace("<div>"+userName1+"</div>","");
      }
    }
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
    loc_roomId1 =roomId;
    console.log('newUser from room:'+roomId);
    require(["vs/editor/editor.main"],function () {
      var con=model.getValue();
      sendNewData(3,[[1,1,1,1]],[con],roomId,socid);
      });
    });
    socket.on('repName',function(old_name,new_name){
      memList.innerHTML=memList.innerHTML.replace("<div>"+old_name,"<div>"+new_name);
      memList.innerHTML=memList.innerHTML.replace("<div>"+old_name+" (Host)","<div>"+new_name+" (Host)");
    });
function sendNewData(op,ranges,texts,roomId,socid) {
  console.log("send to room:",roomId);
  socket.emit('pastMessage',op,ranges,texts,roomId,loc_userId,socid);
}
function sendData(op,ranges,texts,roomId) {
  console.log("send to room:",roomId);
    socket.emit('message',op,ranges,texts,roomId,loc_userId);
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
function changeName(){
  pre_name=loc_userName;
  loc_userName=prompt("Your  name?");
  localStorage.setItem('userName',loc_userName);
  socket.emit('reqRepName',pre_name,loc_userName,loc_roomId1);
  memList.innerHTML=memList.innerHTML.replace("<div>"+pre_name,"<div>"+loc_userName);
  memList.innerHTML=memList.innerHTML.replace("<div>"+pre_name+" (Host)","<div>"+loc_userName+" (Host)");
}
function muteFun(id){
  alert(id);
}