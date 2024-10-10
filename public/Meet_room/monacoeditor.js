let socket = io();
let isHost=0;
let canWrite=0;
let roomDetail={members:[],host:"",write:"",tempHost:"",user:"",roomId:""};
let langg=document.getElementById("langg");
let audFile;
let memList=document.getElementById("members");
let cookieUsername;
let cookieUserid;
let model;
let monEditor;
require.config({ paths: { 'vs': '/monaco-editor/min/vs' }});
require(["vs/editor/editor.main"],function () {
  model=monaco.editor.createModel("","python");
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
    roomDetail.roomId=window.location.href;
    //Getting roomId
    roomDetail.roomId=roomDetail.roomId.replace(/http:\/\/.*\/meet\//i,'');
    roomDetail.roomId=roomDetail.roomId.replace(/https:\/\/.*\/meet\//i,'');
    cookieUsername=getCookie('userName');
    cookieUserid=getCookie('userId');
    console.log(cookieUsername,cookieUserid);
    if(cookieUsername===null || cookieUsername==''){
      cookieUsername=prompt("Your  name?");
      setCookie('userName',cookieUsername);
    }
    else{
      cookieUsername=getCookie('userName');
    }
    if(cookieUserid===null){
      setCookie('userId',generateId(9));
      cookieUserid=getCookie('userId');
    }
    else{
      cookieUserid=getCookie('userId');
    }
    if(roomDetail.roomId!=""){
      socket.emit('c2s_newUser',roomDetail.roomId,cookieUserid,cookieUsername);
      roomDetail.userId=cookieUserid;
      memList.innerHTML="<div>Me</div>"+"<div id=\""+cookieUserid+"\">"+cookieUsername+"</div>";
      memList.innerHTML+="<button id=\"changeName\" onclick=changeName()>Change Name</button>"+"</div>";
      memList.innerHTML+="<div>Members</div>";
    }
  });
  socket.on("s2c_makeHost",function(){
    isHost=1;
    roomDetail.host=cookieUserid;
    cookieUsername=getCookie('userName');
    cookieUserid=getCookie('userId');
    console.log('Host');
    console.log("<div id=\""+cookieUserid+"\">"+cookieUsername+"</div>","<div id=\""+cookieUserid+"\">"+cookieUsername+" (Host)</div>");
    memList.innerHTML=memList.innerHTML.replace("<div id=\""+cookieUserid+"\">"+cookieUsername+"</div>","<div id=\""+cookieUserid+"\">"+cookieUsername+" (Host)</div>");
  });
  socket.on('s2c_writePerm',function(){
    canWrite=1;
    roomDetail.write=cookieUserid;
    console.log('Write');
    require(["vs/editor/editor.main"],function () {
      monEditor.updateOptions({
        "readOnly": false
    });
    });
    let element = document.getElementById("reqWriteAccess");
    //let hidden = element.getAttribute("hidden");
    element.setAttribute("hidden", "hidden");
  });
  socket.on("s2c_addUsers",function(userNames,userIds,hostId){
    cookieUsername=getCookie('userName');
    cookieUserid=getCookie('userId');
      for (let i=0;i<userNames.length;i++){
        if(userIds[i]==hostId && userIds[i]!=cookieUserid){
          roomDetail.host=hostId;
          memList.innerHTML=memList.innerHTML.replace("<div>Members</div>","<div>Members</div>"+"<div id=\""+userIds[i]+"\">"+userNames[i]+" (Host)</div>");
        }
        else{ 
          memList.innerHTML+="<div id=\""+userIds[i]+"\">"+userNames[i]+"</div>";
        }
      }
  });
  socket.on("s2c_addUser",function(userName,userId,hostId){
    cookieUsername=getCookie('userName');
    cookieUserid=getCookie('userId');
      if(userId==hostId && userId!=cookieUserid){
        memList.innerHTML=memList.innerHTML.replace("<div>Members</div>","<div>Members</div>"+"<div id=\""+userId+"\">"+userName+" (Host)</div>");
      }
      else{
        memList.innerHTML+="<div id=\""+userId+"\">"+userName+"</div>";
      }
  });
  socket.on("s2c_delUser",function(userName,userId,hostId){
    console.log("Deleting User:"+userName);
      if(userId==hostId){
        memList.innerHTML=memList.innerHTML.replace("<div id=\""+userId+"\">"+userName+" (Host)</div>","");
      }
      else{
        memList.innerHTML=memList.innerHTML.replace("<div id=\""+userId+"\">"+userName+"</div>","");
      }
    
  });
  
  socket.on('disconnect',function (){
    console.log('disconnected from server');
    socket.emit('userDisc');
  });
  socket.on('s2c_newMessage',function (op,ranges,texts,roomId) {
    console.log('new message');
      realTime(op,ranges,texts,roomId);
  });
  socket.on('s2c_removeWrite',function () {
    canWrite=0;
    console.log('Lost Write');
    require(["vs/editor/editor.main"],function () {
      monEditor.updateOptions({
        "readOnly": true
    });
    });
    let element = document.getElementById("reqWriteAccess");
    element.removeAttribute("hidden");
  });
  socket.on('s2c_askWrite',function (userId,userName) {
    if(confirm('Give Write Access to '+userName)){
      socket.emit('c2s_giveWrite',userId,roomDetail.roomId);
    }
    else{
      socket.emit('c2s_rejectWrite',userId,roomDetail.roomId);
    }
  });
  socket.on('s2c_writeRejected',function () {
    console.log('Write rejected');
    alert('Write Access rejected');
  });
  socket.on('s2c_prevData',function(socid,roomId){
    console.log('newUser into room:'+roomId);
    require(["vs/editor/editor.main"],function () {
      let con=model.getValue();
      sendNewData(3,[[1,1,1,1]],[con],roomId,socid);
      });
    });
    socket.on('s2c_repName',function(old_name,new_name,userId){
      memList.innerHTML=memList.innerHTML.replace("<div id=\""+userId+"\">"+old_name,"<div id=\""+userId+"\">"+new_name);
      memList.innerHTML=memList.innerHTML.replace("<div id=\""+userId+"\">"+old_name+" (Host)","<div id=\""+userId+"\">"+new_name+" (Host)");
    });
function sendNewData(op,ranges,texts,roomId,socid) {
  cookieUserid=getCookie('userId');
  console.log("send new data to socketId:",socid);
  socket.emit('c2s_pastMessage',op,ranges,texts,roomId,cookieUserid,socid);
}
function sendData(op,ranges,texts,roomId) {
    cookieUserid=getCookie('userId');
  console.log("send to room:",roomId,cookieUserid);
    socket.emit('c2s_message',op,ranges,texts,roomId,cookieUserid);
}
function generateId(len){
  let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let rtn = '';
  for(let i=0;i<len;i++){
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
  cookieUserid=getCookie('userId');
  let pre_name=getCookie('userName');
  cookieUsername=prompt("Your  name?");
  setCookie('userName',cookieUsername);
  socket.emit('c2s_reqRepName',pre_name,cookieUsername,cookieUserid,roomDetail.roomId);
  memList.innerHTML=memList.innerHTML.replace("<div id=\""+cookieUserid+"\">"+pre_name,"<div id=\""+cookieUserid+"\">"+cookieUsername);
  memList.innerHTML=memList.innerHTML.replace("<div id=\""+cookieUserid+"\">"+pre_name+" (Host)","<div id=\""+cookieUserid+"\">"+cookieUsername+" (Host)");
}
function muteFun(id){
  alert(id);
}
function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  let cookieArr = document.cookie.split(";");
  
  // Loop through the array elements
  for(const element of cookieArr) {
      let cookiePair = element.split("=");
      
      /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
      if(name == cookiePair[0].trim()) {
          // Decode the cookie value and return
          return decodeURIComponent(cookiePair[1]);
      }
  }
  
  // Return null if not found
  return null;
}

function setCookie(name, value) {
  // Encode value in order to escape semicolons, commas, and whitespace
  let cookie = name + "=" + encodeURIComponent(value);
  let daysToLive=1;
      /* Sets the max-age attribute so that the cookie expires
      after the specified number of days */
      cookie += "; max-age=" + (daysToLive*24*60*60);
      document.cookie = cookie;
}
function reqWriteAccess(){
  cookieUsername=getCookie('userName');
  cookieUserid=getCookie('userId');
  socket.emit('c2s_reqTempWriteAccess',cookieUserid,roomDetail.roomId);
}

function execute(){
  require(["vs/editor/editor.main"],function () {
    let code=model.getValue();
    console.log(code);
    });
}