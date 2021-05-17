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
  socket.on('newMessage',function (op,changes,roomId) {
    realTime(op,changes,roomId);
  });
  socket.on('prevData',function(roomId){
    roomId1 =roomId;
    console.log('newUser from room:'+roomId);
    require(["vs/editor/editor.main"],function () {
    sendData(2,[{range:new monaco.Range(1,1,1,1),text:model.getValue(),forceMoveMarkers:true}],roomId);
    });
  });
function sendData(op,changes,roomId) {
  console.log("send to room:",roomId);
    socket.emit('message',op,changes,roomId,userId);
}
var constraints = {audio: {
  echoCancellation: true,
  noiseSuppression: true,

}}
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    var mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = function(e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function(e) {
        this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function(e) {
        var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        console.log(roomId1,"audio");
        socket.emit('radio', blob,roomId1);
    };
    // Start recording
    mediaRecorder.start();
    // Stop recording after 5 seconds and broadcast it to server
    setInterval(function() {
        mediaRecorder.stop();
        mediaRecorder.start();
    }, 1000);
});
// When the client receives a voice message it will play the sound
socket.on('voice', function(arrayBuffer) {
    var blob = new Blob([arrayBuffer], { 'type' : 'audio/ogg; codecs=opus' });
    var audio = document.createElement('audio');
    audio.src = window.URL.createObjectURL(blob);
    audio.play();
});