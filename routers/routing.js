try{
var express = require("express");
var router = express.Router();

const userController =require("../controllers/userController")
router.get('/',function(req,res){
    res.sendFile(__basedir+"/public/Home/index.html")
  });
  router.get('/player',function(req,res){
    res.sendFile(__basedir+"/public/Player/player.html")
  });
  router.get('/recorder',function(req,res){
    res.sendFile(__basedir+"/public/Recorder/recorder.html")
  });
  router.get('/meet/:editor_room',function(req,res){
    res.sendFile(__basedir+"/public/Meet_room/monaco_room.html")
  });
  router.get('*',function(req,res){
    res.json({Status:404,Message:"Page Not Founnd"});
  });
  router.post('/login',userController.login);
  router.post('/signup',userController.signup);
}
catch(err){
    console.log(err);
}

module.exports = router;