// src/app.ts
import express, { Request, Response } from 'express';
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });
const port = 8000;

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket:any) {
    console.log("A User Has Been Connected!")

    // whenever we receive a 'message' we display it on console
    socket.on("message", function(message: any) {
    console.log(message);
}); 

app.get("/",(req:Request,res:Response)=>{
    res.sendFile(path.resolve("public/main.html"))
});

httpServer.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`)
})

})