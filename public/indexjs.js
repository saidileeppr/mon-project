let socket = io();
const but1=document.getElementById('Submit');
function func1(){
    socket.emit('RoomEntry',$('#roomId').val());
    window.location.replace( window.location.href+'meet/'+$('#roomId').val());
}