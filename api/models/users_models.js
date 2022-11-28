const mongoose= require('mongoose');
const userSchema=mongoose.Schema({
    userId:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        trim:true
    }
},{timestamp:true});
const User = mongoose.model('User',userSchema);
module.exports=User;