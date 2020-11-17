const {ipcRenderer} = require('electron')

var tag = document.createElement('script');


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var width;
var height;
var youtube_id;
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('myPlayer', {
    width: width,
    height: height,
    videoId: youtube_id,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}
function stopVideo() {
  player.stopVideo();
}


const asyncMsgBtn = document.getElementById("async-msg");
console.log(asyncMsgBtn);
asyncMsgBtn.addEventListener('click', () => {
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  // ipcRenderer.invoke('asynchronous-message', 'ping')
})

ipcRenderer.on('create-youtube', (event, _width, _height, _youtube_id) => {
  width = _width;
  height = _height;
  youtube_id = _youtube_id;
})
