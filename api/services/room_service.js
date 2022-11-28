const {Room}=require('../models');

const createRoom=async (roomId,userId)=>{
    try{
    res=  await Room.create({roomId,host:userId,writer:userId,tempHost:'',status:"active"});
    return 1;
    }
    catch(err){
        if(err.code=11000){
            return 11000
        }
    }
};
const delRoom=async (roomId)=>{
    try{
    res = await Room.deleteOne({roomId});
    return 1;
    }
    catch(err){
        console.log(err);
        return 0;
        }
};
const updateTempHost=async (roomId,userId)=>{
    try{
    return  Room.updateOne({roomId},{tempHost:userId});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
const updateWriter=async (roomId,userId)=>{
    try{
    return  Room.updateOne({roomId},{writer:userId});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
const getHost=async (roomId)=>{
    try{
    return  Room.findOne({roomId:roomId},{host:1,_id:0});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
const getWriter=async (roomId)=>{
    try{
    return  Room.findOne({roomId:roomId},{writer:1,_id:0});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
const getHostWriter=async (roomId)=>{
        try{
        return  Room.findOne({roomId:roomId},{writer:1,host:1,_id:0});
        }
        catch(err){
            console.log(err);
            return 0;
        }
};
module.exports={createRoom,delRoom,updateTempHost,updateWriter,getHost,getWriter,getHostWriter};