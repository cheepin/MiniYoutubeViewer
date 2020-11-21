const {ipcRenderer} = require('electron')
const size_offset_width = 0.992;
const size_offset_height = 0.96;

var tag = document.createElement('script');
var width;
var height;
var youtube_id;
var player;

// on Create Window From Main-Process
ipcRenderer.on('create-youtube', (event, params) => {
  width = parseInt(params['width']) * size_offset_width;
  height = parseInt(params['height']) * size_offset_height;
  youtube_id = params['youtube_id'];

  // youtube API invoke
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})

// on YoutubeApi Created
function onYouTubeIframeAPIReady() {
  player = new YT.Player('myPlayer', {
    width: width,
    height: height,
    videoId: youtube_id,
    events: {
      'onReady': onReady,
      'onStateChange': onPlayerStateChange
    }
  });

  // on Ready
  function onReady(event) {
    const yt_controler_id = 'ytp-right-controls';
    event.target.playVideo();
  }

  // on Resized
  ipcRenderer.on("resized-window", (event, _width, _height) => {
    player.setSize(_width * size_offset_width, _height * size_offset_height);
  })
}

// on Stopped Youtube
function stopVideo() {
  player.stopVideo();
}

// on Youtube StateChange
var done = false;
function onPlayerStateChange(event) {
}

