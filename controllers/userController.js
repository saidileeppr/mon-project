const {userRoomService,userService,roomService}=require('../api/services');
async function signup (req,res){
    try{
    cu = await userService.createUser(req.body.userId,req.body.password,req.body.username);
    res.status(201).json({message: 'User Profile Created'});
    }
    catch(err){
        if(err.code==11000){
            console.log("Error Occured");
            res.status(400).json({message: 'UserId exists'});
        }
    }
};
async function login (req,res){
    user_data=await userService.authUser(req.body.userId,req.body.password);
    if(user_data){
        res.status(201).json({message: 'User Exists'});
    }
    else{
        res.status(400).json({message: 'User Credentials did not match'});
    }
};

module.exports={signup,login};