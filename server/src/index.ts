import cors from "cors";
import express, { Express, Request, Response } from "express";
import { createServer } from "node:http";

import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { config } from "./config";
import { handleSocketConnection } from "./controllers/socketController";
import authMiddleware from "./middleware/authMiddleware";
import authRoute from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import { verifyTokenSocket } from "./utils/jwtUtils";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

const app: Express = express();
const server = createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

const port = config.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

mongoose.connect(config.MONGO_URI);

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
app.use(helmet());
app.use(limiter);

app.use("/auth", authRoute);
app.use("/chat", authMiddleware, chatRoutes);

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
