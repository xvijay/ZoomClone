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

let message = document.querySelector("#input-chat");
let messageBox = document.querySelector("#chat-here");
let messageArray = ["First"];

socket.on("message-recevied", (text) => {
  messageArray.push(text);
  let div = document.createElement("div");
  div.innerHTML = text;
  messageBox.append(div);
});

message.addEventListener("keypress", (e) => {
  let text = e.charCode === 13 ? message.value : "";
  text !== "" && sendMessage(text);
});

const sendMessage = (text) => {
  socket.emit("message", text);
  message.value = "";
};
let mute = document.querySelector(".mute");
mute.addEventListener("click", (e) => {
  let unMute = () => {
    x.getAudioTracks()[0].enabled = false;
    mute.innerHTML = "Mute";
  };
  let muteV = () => {
    x.getAudioTracks()[0].enabled = true;
    mute.innerHTML = "Unmute";
  };
  x.getAudioTracks()[0].enabled ? unMute() : muteV();
});
let videoControl = document.querySelector(".videoControl");
videoControl.addEventListener("click", (e) => {
  let hide = () => {
    x.getVideoTracks()[0].enabled = false;
    videoControl.innerHTML = "Show Video";
  };
  let unhide = () => {
    x.getVideoTracks()[0].enabled = true;
    videoControl.innerHTML = "Hide Video";
  };
  x.getVideoTracks()[0].enabled ? hide() : unhide();
});
