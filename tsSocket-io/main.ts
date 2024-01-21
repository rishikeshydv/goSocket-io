import * as express from "express";
import {Server} from "socket.io";
import { createServer } from "http";
import {uuid} from "uuid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });

io.on("connection", (socket) => {
  // ...
});

// to generate a custom session ID 
const genID= () => {
    io.engine.generateId = (req) => {
        return uuid.v4(); // must be unique across all Socket.IO servers
      }
};


io.listen(3000);