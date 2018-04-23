var socket = io();

function scrollToBottom(){
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');

    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >=scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function () {
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
    // var formmatedTime = moment(message.createdAt).format('h:mm a')
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formmatedTime}:  ${message.text}`);
    // jQuery('#messages').append(li);

    var formmatedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formmatedTime
    });
    jQuery('#messages').append(html);
        scrollToBottom();

})

socket.on('newLocationMessage', function(message){
    // var formmatedTime = moment(message.createdAt).format('h:mm a')
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target ="_blank"> My Current Location</a>');
    // li.text(`${message.from} ${formmatedTime} :` );
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);

    var formmatedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: message.createdAt
    });

    jQuery('#messages').append(html);
    scrollToBottom();

})


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextBox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'user',
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
})

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function (err) {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.',err);
    }, {maximumAge:Infinity,timeout : 1000});
});




