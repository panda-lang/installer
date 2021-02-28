const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const setupPug = require("electron-pug")

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

    const errorDialog = (error) => {
        const messageBoxOptions = {
            type: "error",
            title: "Error in Main process",
            message: "Something failed"
        }

        dialog.showMessageBox(messageBoxOptions).then(value => {
            throw error
        })
    }

    process.on('uncaughtException', errorDialog)

    window.loadURL(`file://${__dirname}/views/home.pug`).then(() => {
        window.show()
        window.moveTop()
    }).catch(e => console.error(e))

    let settings = {}

    ipcMain.on('settings', (event, arg) => {
        settings = arg
    })
    ipcMain.on('install', (event, arg) => {
        try {
            if (process.platform === 'win32') {
                require('./windows').install(settings, event)
            }
            else if (process.platform === 'linux') {
                require('./linux').install(settings, event)
            }
            else if (process.platform.darwin === 'darwin') {
                require('./macos').install(settings, event)
            }
        } catch (error) {
            errorDialog(error)
        }
    })

    // window.webContents.openDevTools()
})