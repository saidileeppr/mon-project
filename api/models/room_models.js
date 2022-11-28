const mongoose= require('mongoose');
const roomSchema=mongoose.Schema({
    roomId:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    host:{
        type:String,
        trim:true,
        unique:true
    },
    writer:{
        type:String,
        trim:true
    },
    tempHost:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        trim:true
    },
},{timestamp:true});
const Room = mongoose.model('room',roomSchema);
module.exports=Room;