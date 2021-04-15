const socket = io("/");

const myPeer = new Peer(undefined, {
  host: "/",
  port: "5000",
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  console.log(id);
});
socket.on("user-connected", (userId) => {
  console.log("user connected", userId);
});
