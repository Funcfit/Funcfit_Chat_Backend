const express = require('express');

const dotenv = require("dotenv");
dotenv.config();

const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const morgan = require("morgan");

require("express-async-errors");

const { createServer } = require("http");
//import { createServer } from "http";

//socket
const { Server } = require("socket.io");
//import { Server } from "socket.io";

//connect DB
const connectDB = require("./db/connect.js");
//import connectDB from "./db/connect.js";

const cors = require("cors");
//import cors from "cors";

//middleware
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");
const authenticateUser = require("./middleware/auth.js");
//import notFoundMiddleware from "./middleware/not-found.js";
//import errorHandlerMiddleware from "./middleware/error-handler.js";
//import authenticateUser from "./middleware/auth.js";

//routes
const authRoute = require("./routes/auth.js");
const chatRoute = require("./routes/chat.js");
const messageRoute = require("./routes/message.js");
//import authRoute from "./routes/auth.js";
//import chatRoute from "./routes/chat.js";
//import messageRoute from "./routes/message.js";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Server Running!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/chat", authenticateUser, chatRoute);
app.use("/api/v1/message", authenticateUser, messageRoute);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const server = createServer(app);

const start = async () => {
  try {
    await connectDB(process.env.DB);
    server.listen(port, () =>
      console.log(`Server Running on port : ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //connected to correct id
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join-chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop-typing", (room) => socket.in(room).emit("stop-typing"));

  socket.on("new-message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log(`chat.users not defined`);

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message-received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData._id);
  });
});
