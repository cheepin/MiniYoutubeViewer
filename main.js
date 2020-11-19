const { app, BrowserWindow, ipcMain, ipcRenderer} = require('electron')

// on App Start
const arg_path = process.argv[2];
const args = arg_path.split("/");
const width = parseInt(args[2]);
const height = parseInt(args[3]);
var youtube_id = args[4]

console.log('start');

//作成
function createWindow () {
  const win = new BrowserWindow({
    width: width,
    height: height,
    resizable: true,
    frame: false,
    thickFrame: true,
    backgroundColor: "#FFFFFF",
    webPreferences: {
      nodeIntegration: true
    },
    alwaysOnTop: true,
  })
  win.loadFile('index.html');
  
  // In Debug
  if (process.env.NODE_ENV === "debug") {
    win.webContents.openDevTools();
  }

  // on Ready
  win.once('ready-to-show', () => {
      win.show();
      console.log('ready to show');
      win.webContents.send('create-youtube', width, height, youtube_id);
    }
  )

  // on Resize
  win.on('resize', () => {
    const bounds = win.getBounds();
    win.webContents.send('resized-window', bounds.width, bounds.height);
  });
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

// on Close
ipcMain.handle('close-button-pressed', (event) => {
  app.exit();
})
