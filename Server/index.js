const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const socket = require("socket.io");
const authRoutes = require("./routers/userRoute");
const messageRoutes = require("./routers/messages");

require("dotenv").config();

const app=express();
const port=process.env.PORT || 7700;
const DBurl=process.env.MONGO_URL;

const _dirname = path.resolve();

app.get("/ping", (_req, res) => {
    return res.json({ msg: "Ping Successful" });
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(_dirname, "/chatbox/build")));
app.get('*', (req,res)=>{
  res.sendFile(path.resolve(_dirname, "chatbox", "build", "index.html"));
});

const server = app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
});


mongoose.connect(DBurl)
.then(()=>{
    console.log("DB connected successfully!");
})
.catch((error)=>{
    console.log(error)
});

const io = socket(server, {
    cors: {
      origin: process.env.ORIGIN,
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });
  