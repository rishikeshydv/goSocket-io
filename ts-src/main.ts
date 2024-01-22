import express from "express";
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";
//import {uuid} from "uuid";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer,{ /* options */ });




