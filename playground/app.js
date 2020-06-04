const { app, BrowserWindow, ipcMain } = require('electron')
const setupPug = require("electron-pug")

let settings = {}

app.whenReady().then(async () => {
    let pug = await setupPug({ pretty: true }, {})
    pug.on('error', err => console.error('electron-pug error', err))

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

    const window = new BrowserWindow({
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
    })

    window.loadURL(`file://${__dirname}/views/home.pug`).then(() => {
        window.show()
        window.moveTop()
    }).catch(e => console.error(e))

    ipcMain.on('set-settings', (event, arg) => {
        settings = arg
        console.log(arg)
    })
    ipcMain.on('get-settings', (event, arg) => {
        event.returnValue = settings
    })

    window.webContents.openDevTools()
})