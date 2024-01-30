//'io' in the client side is imported from <script src="/socket.io/socket.io.js"></script>
// which is already mentioned in room.ejs


//for "id's"
const messageSection = document.getElementById('chat-messages');
const inputMessage = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
// const feedback = document.getElementById('feedback');

const socket = io.connect("http://localhost:8000");


sendButton?.addEventListener('click',()=>{
    socket.emit('sendMessage',inputMessage?.value);
    const messageElement = document.createElement('div');
    messageElement.textContent = inputMessage?.value;
    messageSection?.appendChild(messageElement);
    inputMessage.value="";
});

// socket.on('typing', (user:any) => {
//     feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
// })


// //Displaying the message sent from user
// socket.on('message', (data:any) => {
//     output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
//     feedback.innerHTML = '';
//     document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

// })
