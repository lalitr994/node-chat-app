const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket)=>{
    console.log('New user connected');
   
    socket.on('createMessage', (msg)=>{
        console.log('createMessage', msg);
        io.emit('newMessage',{
            from : msg.from,
            text : msg.text,
            createdAt : new Date().getTime()
        })
    })

    socket.on('disconnect',()=>{
        console.log('User was disconnected');
    })


    

 
})




server.listen(port,()=>{
    console.log(`***Server running at ${port}***`)
})


console.log(publicPath);