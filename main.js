const { app, BrowserWindow } = require('electron')
const ioHook = require('iohook')
const path = require('path')
const PersistanceService = require('./persistance-service')
const { collect, readFileAsString } = require('./utils')

const isDebugMode = !app.isPackaged

const dataFile = './data.json'
const layoutFile = './layout.json'
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

async function readLayout() {
    try {
        const dataAsString = await readFileAsString(layoutFile)

        const data = JSON.parse(dataAsString)

        return data
    } catch(ex) {
        console.error("Failed to read keyboard layout configuration")
        console.error(ex)
    }
}

async function main() {
    const window = createWindow()

    console.log('Window opened')

    const sendLayout = layout => window.webContents.send('layout', layout)

    const sendData = data => window.webContents.send('data', data)

    const persistanceSvc = new PersistanceService

    const layout = await readLayout()

    const data = await persistanceSvc.readData(dataFile)

    console.log('Data loaded')

    window.webContents.on('did-finish-load', () => {
        sendLayout(layout)
        sendData(data)

        console.log('Data sent')
    })

    ioHook.on('keyup', (event) => {
        collect(event, data)

        if (isDebugMode && !window.isFocused())
            return

        sendData(data)
    })

    ioHook.start(false)

    setInterval(
        () => persistanceSvc.saveData(dataFile, data), 
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
