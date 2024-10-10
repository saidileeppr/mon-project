
const express = require('express');
const routing=require('./routing');
const PORT = process.env.PORT ||4004;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const http = require("http");
const server = http.createServer(app,{cookie: true});
app.use(cors());
app.use(cookieParser('Sai@2o00'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(routing);
server.listen(PORT,function(){
  console.log(`Server is up on port ${PORT}`);
});
require('./socket').startApp(server);