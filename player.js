const {ipcRenderer} = require('electron')

var tag = document.createElement('script');

var width;
var height;
var youtube_id;
var player;

// on Create
ipcRenderer.on('create-youtube', (event, _width, _height, _youtube_id) => {
  width = _width;
  height = _height;
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

// on stopped Youtube
function stopVideo() {
  player.stopVideo();
}

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
const asyncMsgBtn = document.getElementById("async-msg");
console.log(asyncMsgBtn);
asyncMsgBtn.addEventListener('click', () => {
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // ipcRenderer.invoke('asynchronous-message', 'ping')
})

