const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidV4 } = require("uuid");
const { Socket } = require("socket.io");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.emit("user-connected", userId);
    console.log(socket.to(roomId).BroadcastOperator);
  });
});

server.listen(5000, () => {
  console.log("Server Started");
});
