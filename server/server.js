const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();


app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, cb) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return cb('Name and Room Name are required.')
        }

        // To allow communication in same room only
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
        cb();
    })

    socket.on('createMessage', (message, cb) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        cb('This is from  server');
    })

    socket.on('createLocationMessage', (chords) => {
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, chords.latitude, chords.longitude))
        }
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
        
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`))
        }
    })





})




server.listen(port, () => {
    console.log(`***Server running at ${port}***`)
})


console.log(publicPath);