import express, { Request, Response } from "express";
import * as path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import { type } from "os";
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

//setting up prisma ORM
const prisma = new PrismaClient();

//setting up socket.io server
const app = express();
app.use(express.static("public"));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});
const port = 8000;

interface userCredentials {
  roomId: string;
  name: string;
  currentMessage: string;
  time: string;
}

var allUsers: any = {};
var fullChat: any = {};

app.get("/", (req: Request, res: Response) => {
  res.render("index.ejs");
});

app.get("/agents", (req: Request, res: Response) => {
  async function userList(): Promise<any> {
    try {
      var usersRes = await prisma.transactions.findMany();
      res.json(usersRes);
    } catch (error) {
      console.log(error);
    }
  }
});
//                                    WEBSOCKETS PART

// function getUsers(userList: any) {
//   var onlineUsers: any = [];
//   userList.forEach((element: any) => {
//     onlineUsers.push(element);
//   });
//   return onlineUsers;
// }

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected

io.on("connection", (socket: any) => {
  console.log("A New User Connected");
  socket.on("broker-connect", function (data: string) {
    //the roomId is hashed
    const hash = crypto.createHash("sha256");
    hash.update(data);
    const hashedRoomId = hash.digest("hex");

    //joining the socket
    socket.join(hashedRoomId);

    prisma.chatHistory.create({
      data: {
        fullChat: [],
        roomId: hashedRoomId,
      },
    });
  });

  //whenever we receive a disconnect signal, we
socket.on("disconnect", function () {
  var rooms = Object.keys(socket.rooms);
  var socketId = rooms[0];
  var roomname = rooms[1];
  allUsers[roomname].forEach((user: any, index: any) => {
    if (user[socketId]) {
      allUsers[roomname].splice(index, 1);
    }
  });
});

// whenever we receive a 'message' we log it out
// socket.on("sendMessage", function (currMsg: any) {
//   socket.broadcast.to(hashedRoomId).emit("message",currMsg);
//   prisma.chatHistory.update({
//     where: {
//       roomId: hashedRoomId,
//     },
//     data: {
//       fullChat:{
//         push:currMsg,
//       }
//     }
//   }).then(()=> {
//     console.log("Update Successful");
//   }).catch((error)=>{
//     console.error("Error updating chat history")
//   })
// });

});

//Broadcasting the user who is typing
//     socket.on("typing", (data: any) => {
//       socket.broadcast.to(data.roomname).emit("typing", data.username);
//     });
//   });
// });

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
