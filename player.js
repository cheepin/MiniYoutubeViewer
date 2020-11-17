const {ipcRenderer} = require('electron')
const readBtn = document.getElementById("read-button");
const closeBtn = document.getElementById("close-button");
const size_offset_width = 0.99;
const size_offset_height = 0.99;

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

// on Youtube StateChange
var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}

// on Read Button Clicked
readBtn.addEventListener('click', () => {
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})

// on Close Button Clicked
closeBtn.addEventListener('click', () => {
  ipcRenderer.invoke('close-button-pressed');
})