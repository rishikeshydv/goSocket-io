//'io' in the client side is imported from <script src="/socket.io/socket.io.js"></script>
// which is already mentioned in room.ejs

//for "id's"
const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback');

//for "class"
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

const socket = io.connect("http://localhost:8000");   


socket.emit('new-user',()=>{

});