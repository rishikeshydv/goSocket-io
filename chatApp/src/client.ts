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

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');
const roomname = urlParams.get('roomname');
console.log(username, roomname);   

socket.emit('new-user',{
    username: username,
    roomname: roomname
});

send?.addEventListener('click',()=>{
    socket.emit('message',{
    username: username,
    message: message.value,
    roomname: roomname
    })
});

socket.on('typing', (user:any) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})

socket.on('joined-user', (data:any)=>{
    output.innerHTML += '<p>--> <strong><em>' + data.username + ' </strong>has Joined the Room</em></p>';
})

//Displaying the message sent from user
socket.on('message', (data) => {
    output.innerHTML += '<p><strong>' + data.username + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying online users
socket.on('online-users', (data:any) =>{
    users.innerHTML = ''
    data.forEach((user:any) => {
        users.innerHTML += `<p>${user}</p>`
    });
})


//                      DATABASE

async function userTemplate(){
    const response  = await fetch("/users");
    const users = await response.json();

    //we will append all the users inside this <div> tag
    const getDiv = document.querySelector('.profile-container');

    users.forEach((user:any)=>{
        const userDiv = document.createElement("div");
        userDiv.classList.add("profile-container")
        
        userDiv.innerHTML = `

        <div class="profile-left">
        <!-- Round portion for user image -->
        <img
          src="userProfile.png"
          height="20px"
          width="20px"
          alt="User Image"
          class="user-image"
        />
      </div>
      <div class="profile-middle">
        <!-- Username -->
        <h2>${user.username}</h2>
      </div>
      <div class="profile-right">
        <!-- 'Send Request' button -->
        <button class="send-request-button">Send Request</button>
      </div>
        `;
    
    getDiv?.appendChild(userDiv)
    })
}