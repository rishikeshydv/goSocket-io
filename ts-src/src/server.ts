import express, { Request, Response } from 'express';
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";
import { type } from 'os';

const app = express();
app.use(express.static('public'));
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });
const port = 8000;

interface userCredentials{
  username:string;
  roomname : string; 
}

var allUsers:any = {};

app.get("/",(req:Request,res:Response)=>{
    res.render('index.ejs')
});

app.post("/room",(req:Request,res:Response)=>{
    var roomname = req.body.roomname;
    var username = req.body.username;
    res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

//                                    WEBSOCKETS PART


function getUsers(userList:any) {
  var onlineUsers:any = [];
  userList.forEach((element:any) => {
    onlineUsers.push(element)
  });
  return onlineUsers
}

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected

io.on("connection", (socket:any) => {
  console.log('A New User Connected');
  socket.on('new-user',function(data:userCredentials){
  
    //creating a user dictionary 'in memory'
    var user:any = {};
    user[socket.id] = data.username;
    if (allUsers[data.roomname]){
        allUsers[data.roomname].push(data.username)
    }
    else {
      allUsers[data.roomname] = [data.username];
    }

    //joining the socket
    socket.join(data.roomname);

    //Emitting New Username to Clients in that socket
    io.to(data.roomname).emit('new-user',{username:data.username})

    //Send online users array
    io.to(data.roomname).emit('online-users', getUsers(allUsers[data.roomname]))
    
  })
    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
    console.log(message);

  })

  //whenever we receive a disconnect signal, we
  socket.on("disconnect", function(){
    console.log("User Disconnected");
  })
  })

httpServer.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
