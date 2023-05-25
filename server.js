const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000;

const mongoose = require("mongoose");
const Dicegame = require("./models");

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/devmongoosesocket3");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();

app.use(express.static("public"));

//endpoint för dice
app.get("/dice", async (req, res) => {
  try {
    const alldicegame = await Dicegame.find();
    return res.status(200).json(alldicegame);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

setInterval(() => {
  let today = new Date();
  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  io.emit("time", time);
}, 1000);

io.on("connection", (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  socket.on("chatMessage", (msg) => {
    io.emit("newChatMessage", { user: msg.user, message: msg.message });
  });

  socket.on("dice", (msg) => {
    io.emit("diceresult", {
      user: msg.user,
      throwdice: msg.throwdice,
      sum: msg.sum,
    });
    const dice = new Dicegame({
      user: msg.user,
      throwdice: msg.throwdice,
      sum: msg.sum,
    });
    dice.save();
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
