import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";

import mongoose from "mongoose";
import { Server } from "socket.io";
import { handleSocketConnection } from "./controllers/socketController";
import authMiddleware from "./middleware/authMiddleware";
import authRoute from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import { verifyTokenSocket } from "./utils/jwtUtils";

dotenv.config();

const app: Express = express();
const server = createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

mongoose.connect(process.env.MONGO_URI as string, {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

io.use((socket, next) => {
  const token = socket.handshake.query.token as string;
  verifyTokenSocket(token, (err, decoded) => {
    if (err) {
      return next(err);
    }

    socket.data.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

app.use(express.json());
app.use(cors());

app.use("/auth", authRoute);
app.use("/chat", authMiddleware, chatRoutes);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
