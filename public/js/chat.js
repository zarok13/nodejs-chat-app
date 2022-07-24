const socket = io();

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    const newMessage = $('#messages').children().last();


    const newMessageStyles = getComputedStyle(newMessage[0]);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage[0].offsetHeight + newMessageMargin;

    const visibleHeight = $('#messages')[0].offsetHeight;
    const containerHeight = $('#messages')[0].scrollHeight;

    const scrollOffset = $('#messages')[0].scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
    
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
    }
}

socket.on('message', (message) => {
    // console.log(message);
    const html = Mustache.render($('#message-template').html(), {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $('#messages').append(html);
    autoscroll();
});
socket.on('locationMessage', (message) => {
    // console.log(url);
    const html = Mustache.render($('#location_message-template').html(), {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $('#messages').append(html);
});
socket.on('roomData', ({room, users}) => {
    const html = Mustache.render($('#sidebar-template').html(),{
        room,
        users
    });
    $('#sidebar').html(html);
})


$(document).ready(function () {
    $('#message-form').on('submit', (e) => {
        e.preventDefault();

        $('#send-message').attr('disabled', 'disabled');
        const message = $(this).find('input[name="message"]').val();

        socket.emit('sendMessage', message, (error) => {
            $('#send-message').attr('disabled', false);
            $(this).find('input').val('');
            $(this).find('input').focus();
            if (error) {
                return console.log(error);
            }

            console.log('message delivered');
        });
    });

    $('#send-location').on('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
        }
        $('#send-location').attr('disabled', 'disabled');

        navigator.geolocation.getCurrentPosition((pos) => {
            let data = {
                long: pos.coords.longitude,
                lat: pos.coords.latitude
            };
            socket.emit('sendLocation', data, () => {
                $('#send-location').attr('disabled', false);
                console.log('Location shared!');
            });
        });
    })
});
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});