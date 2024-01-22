// src/app.ts
import express, { Request, Response } from 'express';
import * as path from "path";
import {Server} from "socket.io";
import { createServer } from "http";

const app = express();
const port = 8000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express Server!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
