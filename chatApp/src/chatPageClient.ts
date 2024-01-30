//'io' in the client side is imported from <script src="/socket.io/socket.io.js"></script>
// which is already mentioned in room.ejs


//for "id's"
const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
// const feedback = document.getElementById('feedback');

//for "class"
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

const socket = io.connect("http://localhost:8000");

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');

send?.addEventListener('click',()=>{
    socket.emit('message',{
    username: username,
    message: message.value,
    roomname: roomname
    })
});

// socket.on('typing', (user:any) => {
//     feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
// })


//Displaying the message sent from user
socket.on('message', (data:any) => {
    output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})
