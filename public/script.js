const videoGrid = document.getElementById("video-grid");
let x;
const myPeer = new Peer(undefined, {
  host: "/",
  port: "5000",
  path: "/peerjs",
});
const myVideo = document.createElement("video");
myVideo.muted = true;
const peers = {};
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    addVideoStream(myVideo, stream);
    console.log("in then");
    x = stream;

    socket.on("user-connected", (userId) => {
      console.log("connect");
      console.log("user-connected", userId);
      connectToNewUser(userId, stream);
    });
  });
myPeer.on("call", (call) => {
  console.log("answer", x);
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      console.log();
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });
});

socket.on("user-disconnected", (userId) => {
  console.log("user-disconnected");
  if (peers[userId]) peers[userId].close();
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  console.log("called");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
