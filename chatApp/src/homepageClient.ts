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