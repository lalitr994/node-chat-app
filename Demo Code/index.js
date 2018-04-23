var socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (msg) {
    console.log('Email', msg);

    var li = jQuery("<li></li>");
    li.text(`${msg.from}:  ${msg.text}`);

    jQuery('#messages').append(li);
})


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'user',
        text: jQuery('[name=message]').val()
    }, function () {

    });
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    console.log("I am clicked");
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function (err) {
        alert('Unable to fetch location.',err);
    }, {maximumAge:Infinity,timeout : 1000});
});




