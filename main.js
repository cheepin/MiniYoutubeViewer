const { app, BrowserWindow, ipcMain} = require('electron')


//引数
var width = parseInt(process.argv[2]);
var height = parseInt(process.argv[3]);
var youtube_id = process.argv[4];

//作成
function createWindow () {
  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true
  })
  win.loadFile('index.html');
  // win.webContents.openDevTools();

    win.once('ready-to-show', () => {
        win.show();
        console.log('ready to show');
        win.webContents.send('create-youtube', width, height, youtube_id);
    })
}

app.whenReady().then(createWindow)


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// ipcMain.handle('create-youtube', (event, url) => {
//   console.log(`receive ${arg}`);
// })