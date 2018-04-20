var socket = io();

socket.on('connect',function(){
    console.log('Connected to server');

    socket.emit('createMessage',{
        from : 'Lalit',
        text : 'Got!! a email'        
    })
        
});

socket.on('disconnect',function(){
    console.log('Disconnected from server');
});

socket.on('newMessage', function(msg){
    console.log('Email', msg);
})


