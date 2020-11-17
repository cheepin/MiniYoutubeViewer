const {ipcRenderer} = require('electron')
const asyncMsgBtn = document.getElementById("read-button");
const closeBtn = document.getElementById("close-button");
const size_offset_width = 0.95;
const size_offset_height = 0.92;

var tag = document.createElement('script');
var width;
var height;
var youtube_id;
var player;

// on Create
ipcRenderer.on('create-youtube', (event, _width, _height, _youtube_id) => {
  width = _width * size_offset_width;
  height = _height * size_offset_height;
  youtube_id = _youtube_id;
})

// on YoutubeApi Created
function onYouTubeIframeAPIReady() {
  player = new YT.Player('myPlayer', {
    width: width,
    height: height,
    videoId: youtube_id,
    events: {
      'onReady': (event) => event.target.playVideo(),
      'onStateChange': onPlayerStateChange
    }
  });
}

// on Stopped Youtube
function stopVideo() {
  player.stopVideo();
}

// on Resized
ipcRenderer.on("resized-window", (event, _width, _height) => {
  console.log(`resized message from main ${_width}: ${_height}`);
  player.setSize(_width * size_offset_width, _height * size_offset_height);
})

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}

// on Async Message Button Clicked
console.log(asyncMsgBtn);
asyncMsgBtn.addEventListener('click', () => {
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // ipcRenderer.invoke('asynchronous-message', 'ping')
})

closeBtn.addEventListener('click', () => {
  ipcRenderer.invoke('close-button-pressed');
})