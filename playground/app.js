const { app, BrowserWindow } = require('electron')
const path = require("path")
const setupPug = require("electron-pug")

app.whenReady().then(async () => {
    macIsDisabledSoLetsFixIt(app)

    let pug = await setupPug({
        pretty: true
    }, {})
    pug.on('error', err => console.error('electron-pug error', err))

    const win = new BrowserWindow({
        width: 860,
        height: 510,
        resizable: false,
        frame: false,
        show: false,
        backgroundColor: '#000000',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    win.loadURL(`file://${__dirname}/views/home.pug`).then(() => {
        win.show()
        win.moveTop()
    }).catch(e => console.error(e));

    win.webContents.openDevTools()
});

function macIsDisabledSoLetsFixIt(app) {
    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })
  
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
}