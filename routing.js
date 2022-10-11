try{
var express = require("express");
var router = express.Router();
router.get('/',function(req,res){
    res.sendFile(__dirname+"/public/index.html")
  });
  router.get('/player',function(req,res){
    res.sendFile(__dirname+"/public/player.html")
  });
  router.get('/meet/:editor_room',function(req,res){
    res.sendFile(__dirname+"/public/monaco_room.html")
  });
  router.get('*',function(req,res){
    res.json({Status:404,Message:"Page Not Founnd"});
  });
}
catch(err){
    console.log(err);
}
module.exports = router;