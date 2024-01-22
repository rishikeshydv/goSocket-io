import express, { Request, Response } from 'express';
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";

const app = express();
app.use(express.static('public'));
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });
const port = 8000;

app.get("/",(req:Request,res:Response)=>{
    res.render('index.ejs')
});

app.post("/room",(req:Request,res:Response)=>{
    var roomname = req.body.roomname;
    var username = req.body.username;
    res.redirect(`/room?username=${username}&roomname=${roomname}`)
})

//                                    WEBSOCKETS PART


// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket:any) => {
    console.log("A User Has Been Connected!")
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
