const {User}=require('../models');

const createUser=async (userId,password,username)=>{
    return  User.create({userId,password,username});
};
const authUser=async (userId,password)=>{
    return User.findOne({userId:userId,password:password});
}
module.exports={createUser,authUser};