const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 5000;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use("/peerjs", peerServer);

// Get API
app.get("/", (req, res) => {
  //   res.status(200).send({ message: "Hello from Server" });
  //   res.send({ message: "Hello from SERVER" });
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room.ejs", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log("disconnected");
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
    socket.on("message", (text) => {
      console.log(text);
      io.to(roomId).emit("message-recevied", text);
    });
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
