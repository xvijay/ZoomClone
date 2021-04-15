// Gobal
const videoGrid = document.querySelector("#videoGrid");
let myStream;
let myVideo = document.createElement("video"); /// Create a video play
myVideo.muted = true; /// By default it is muted
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "5000",
});
// TO get audio and video access
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((res) => {
    myStream = res;
    addVideoStream(myVideo, res);
  });

//   Conections

// Sockect
socket.on("user-connected", (userId) => {
  console.log("connected");
  connectToNewUser(userId, myStream);
});
peer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});
peer.on("call", function (call) {
  call.answer(myStream);
  const video = document.createElement("video");
  console.log(call);
  call.on("stream", (myStream1) => {
    console.log("answer");
    // addVideoStream(video, myStream1);
    video.srcObject = myStream1;
    video.muted = true;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    document.querySelector("#videoGrid2").append(video);
  });
});

// Functions

const connectToNewUser = (userId, stream) => {
  console.log(roomId, "newUser", userId);
  const call = peer.call(userId, myStream);
  const video = document.createElement("video");
  console.log(call);
  setTimeout(() => {
    call.on("data", function (remoteStream) {
      // Show stream in some video/canvas element.
      console.log(remoteStream);
    });
  }, 5000);
};

// Render Video
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.muted = true;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};
