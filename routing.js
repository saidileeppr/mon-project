try{
const express = require("express");
const router = express.Router();
router.get('/',function(req,res){
    res.sendFile(__dirname+"/public/index.html")
  });
  router.get('/player',function(req,res){
    res.sendFile(__dirname+"/public/Player/player.html")
  });
  router.get('/recorder',function(req,res){
    res.sendFile(__dirname+"/public/Recorder/recorder.html")
  });
  router.get('/meet/:editor_room',function(req,res){
    res.sendFile(__dirname+"/public/Meet_room/monaco_room.html")
  });
  router.get('*',function(req,res){
    res.json({Status:404,Message:"Page Not Founnd"});
  });
  module.exports = router;
}
catch(err){
    console.log(err);
}

