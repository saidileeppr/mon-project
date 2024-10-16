try{
const express = require("express");
const router = express.Router();
router.get('/',function(req,res){
    res.sendFile(__dirname+"/public/index.html")
  });
  router.get('/player',function(req,res){
    res.sendFile(__dirname+"/public/Player/Player.html")
  });
  router.get('/recorder',function(req,res){
    res.sendFile(__dirname+"/public/Recorder/Recorder.html")
  });
  router.get('/meet/:editor_room',function(req,res){
    res.sendFile(__dirname+"/public/Meet/Meet.html")
  });
  router.get('*',function(req,res){
    res.sendFile(__dirname+"/public/error.html")
  });
  module.exports = router;
}
catch(err){
    console.log(err);
}

