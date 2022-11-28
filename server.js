const path = require('path');
const http = require('http');
const express = require('express');
const routing=require('./routers/routing');
const PORT = process.env.PORT ||5123;
const cors = require('cors');
const cookieParser = require('cookie-parser');
var app = express();
global.__basedir = __dirname;
let server = http.createServer(app,{cookie: true});
var logger= require('./logger');
const mongoose=require('mongoose');
module.exports=server;
mongoose.connect('mongodb+srv://mon_server:0xUfx9mrOk00HVWp@monproject.spdjzkb.mongodb.net/db_auth?retryWrites=true&w=majority').then(() => {
  logger.info('Connected to MongoDB');
});
app.use(cors());
app.use(cookieParser('Sai@2o00'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(routing);
server.listen(PORT,function(){
  logger.info(`Server is up on port ${PORT}`);
  console.log(`Server is up on port ${PORT}`);
});
require('./socket');
//require('./sample');