import express from "express";
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";
//import {uuid} from "uuid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });

io.on("connection", (socket:any) => {
  console.log("A User Has Been Connected!")
});

app.get("/",(req:any,res:any)=>{
    res.sendFile(path.resolve("index.html"))
});

// to generate a custom session ID 
// export default function genID () {
//     io.engine.generateId = () => {
//         return uuid.v4(); // must be unique across all Socket.IO servers
//       }
// };


httpServer.listen(3001);
