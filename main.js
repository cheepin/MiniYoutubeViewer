const {
  app,
  BrowserWindow,
  ipcMain,
  remote,
  dialog,
} = require('electron')

const debug_path = 'youtube://7TA_VPCh7K0/?width=1920&height=1080'
var whole_args = process.argv[1]
if (process.env.NODE_ENV === "debug" || process.env.NODE_ENV === "release") {
  whole_args = process.argv[2]
}

const custom_schema = 'miniyp'
const NON_ARGS_LENGTH = 1

// on App Start
app.whenReady().then(()=>{
  // Assume Initial App Boot
  if (process.argv.length <= NON_ARGS_LENGTH){
    var notice_win = new BrowserWindow({
      width: 1920,
      height: 1080,
      resizable: true,
      thickFrame: true,
      autoHideMenuBar: true,
      backgroundColor: "#FFFFFF",
      webPreferences: {
        nodeIntegration: true
      },
      alwaysOnTop: true,
    });
  
    var options = {
      type: 'info',
      buttons: ['Yes', 'No'],
      title: 'confirm',
      message: 'confirm',
      detail: `you must register the default protocol \'miniyp\' to use this app. \notherwise exit \n${process.argv}`
    };
    if (!dialog.showMessageBoxSync(notice_win, options)){
      app.setAsDefaultProtocolClient(custom_schema, undefined, ['--', '%1'])
    }
    app.exit()
  }

  // Normal App Start
  else {
    try{
      // receive arg
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
      dialog.showErrorBox('args invalid', `non valid url or args: ${ process.argv}`)
      app.exit()
    }
    createWindow(param_keys);

  }
})


// on create window
function createWindow (param_keys) {
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
      win.webContents.send('create-youtube', param_keys);
    }
  )

  // on Resize
  win.on('resize', () => {
    const bounds = win.getBounds();
    win.webContents.send('resized-window', bounds.width, bounds.height);
  });
}

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
