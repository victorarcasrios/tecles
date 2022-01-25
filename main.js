const { app, BrowserWindow, ipcMain } = require('electron')
const ioHook = require('iohook')
const path = require('path')
const PersistanceService = require('./persistance-service')
const { collect, updateLabel } = require('./utils')

const isDebugMode = !app.isPackaged

const file = './data.json'
const saveIntervalInSeconds = 10

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

app.whenReady()
    .then(() => {
        main()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) 
                main()
        })
    })

async function main() {
    const window = createWindow()

    console.log('Window opened')

    const sendData = data => window.webContents.send('data', data)

    const persistanceSvc = new PersistanceService

    const data = await persistanceSvc.readData(file)

    console.log('Data loaded')

    window.webContents.on('did-finish-load', () => {
        sendData(data)
    })

    ipcMain.handle('update-key-label', (event, {keycode, label}) => {
        updateLabel(data, keycode, label)

        persistanceSvc.saveData(file, data)
    })

    ioHook.on('keyup', (event) => {
        collect(event, data)

        if (window.isFocused())
            return

        sendData(data)
    })

    ioHook.start(false)

    setInterval(
        () => persistanceSvc.saveData(file, data), 
        saveIntervalInSeconds * 1000
    ) 
}

function createWindow() {
    const window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    window.loadFile('index.html')

    if (isDebugMode)
        window.webContents.openDevTools({mode: 'detach'})

    return window
}
