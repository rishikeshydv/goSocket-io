//this is the client side script for the homepage

const port = 8000   //change your portname as per your app
const requestButton = document.getElementById('user1')   //change the 'id' as per the button 'id'
const socket = io.connect(`http://localhost:${port}`); 

requestButton?.addEventListener('click',()=>{
    //roomId will be of the pattern hash(`broker-client`)
    const roomId = 'broker-client'
    socket.emit('broker-connect',roomId)
    window.location.href = 'views/room.ejs';
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