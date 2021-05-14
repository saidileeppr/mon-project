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
var constraints = { audio: true };
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