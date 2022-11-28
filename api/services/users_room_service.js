const {UserRoom}=require('../models');

const createUserRoom=async (userId,socketId,roomId,username)=>{
    try{
    res=  await UserRoom.create({userId,socketId,roomId,username});
    return 1;
    }
    catch(err){
        if(err.code=11000){
            console.log("Room Already Exists");
            return 11000;
        }
        else{
            console.log(err);
            return 0;
        }
    }
};

const getRoom=async (userId)=>{
    return  UserRoom.findOne({ userId: userId}, {_id:0,roomId:1});
};
const getUserRoom=async (socketId)=>{
    return  UserRoom.findOne({ socketId: socketId}, {_id:0});
};
const getUserId=async (socketId)=>{
    return  UserRoom.findOne({ socketId: socketId}, {userId:1,_id:0});
};

const getSocketId=async (userId)=>{
    return  UserRoom.findOne({ userId: userId}, {socketId:1,_id:0});
};

const exitRoom=async (userId)=>{
    return UserRoom.deleteOne({userId});
}

const changeName=async (userId,username)=>{
    return UserRoom.updateOne({userId},{username});
}

const delUserRoom=async (userId)=>{
    return UserRoom.deleteOne({userId});
}
const getMembers=async (roomId)=>{
    try{
    return  UserRoom.find({roomId:roomId},{roomId:1,_id:0});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
const getMembersDetails=async (roomId)=>{
    try{
    return  UserRoom.find({roomId:roomId},{_id:0,userId:1,username:1});
    }
    catch(err){
        console.log(err);
        return 0;
    }
};
module.exports={createUserRoom,getRoom,getUserRoom,getUserId,getSocketId,exitRoom,changeName,delUserRoom,getMembers,getMembersDetails};