const { app, BrowserWindow, ipcMain, ipcRenderer} = require('electron')

// on App Start
const debug_path = 'youtube://7TA_VPCh7K0/?width=1920&height=1080'
try{
  // receive arg
  const whole_args = process.argv[2]
  const args = whole_args.split('://')[1]
  const splitted_params = args.split('?')
  query =  splitted_params[1].split('&')

    // parse arg
  var param_keys = {}
  param_keys['youtube_id'] = splitted_params[0]
  query.forEach(item => {
    key_value = item.split('=')
    param_keys[key_value[0]] = key_value[1]
    console.log(item)
  });
}
catch(e){
  alert('non valid url or args')
  app.exit()
}

// on create window
function createWindow () {
  const win = new BrowserWindow({
    width: parseInt(param_keys['width']),
    height: parseInt(param_keys['height']),
    resizable: true,
    thickFrame: true,
    autoHideMenuBar: true,
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
      win.webContents.send('create-youtube', parseInt(param_keys['width']), parseInt(param_keys['height']), param_keys['youtube_id']);
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
