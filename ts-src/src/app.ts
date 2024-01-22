// src/app.ts
import express, { Request, Response } from 'express';
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });
const port = 8000;

// to generate a custom session ID 
// export default function genID () {
//     io.engine.generateId = () => {
//         return uuid.v4(); // must be unique across all Socket.IO servers
//       }
// };


// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket:any) => {
    console.log("A User Has Been Connected!")
    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
    console.log(message);
  })
}); 

app.get("/",(req:Request,res:Response)=>{
    res.sendFile(path.resolve("public/index.html"))
});

httpServer.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})
