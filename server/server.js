const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const { generateMessage } = require('./utils/message');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

    // socket.broadcast.emit from admin text new user
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


    socket.on('createMessage', (msg, cb) => {
        console.log('createMessage', msg);
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        // socket.broadcast.emit('newMessage', {
        //     from: msg.from,
        //     text: msg.text,
        //     createdAt: new Date().getTime()
        // })
        cb('This is from  server');
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })





})




server.listen(port, () => {
    console.log(`***Server running at ${port}***`)
})


console.log(publicPath);