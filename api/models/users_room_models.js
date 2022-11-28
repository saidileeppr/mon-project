const mongoose= require('mongoose');
const userRoomSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    socketId:{
        type:String,
        trim:true,
        unique:true
    },
    roomId:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        trim:true
    },
},{timestamp:true});
const userRoom = mongoose.model('user_room',userRoomSchema);
module.exports=userRoom;