const ioHook = require('iohook')
const keyCode = require('keycode')
const fs = require('fs/promises')

const dataFile = './data.json'
const layoutFile = './layout.json'
const saveIntervalInSeconds = 10

let lastDataWritten = null

console.log('Loading...')

Promise.all([
    readData(dataFile),
    readJsonFile(layoutFile)
]).then(([data, layout]) => {
    console.log('Ready')

    // console.debug(layout)

    ioHook.on('keydown', (event) => {
        collect(event, data)

        console.clear()
        console.log(event)

        render(data)
    })

    ioHook.start(false)

    setInterval(() => saveData(dataFile, data), saveIntervalInSeconds * 1000) 
})

async function readData(file) {
    let history = new Map()

    try {
        const data = await readJsonFile(file)

        if (data.length)
            history = new Map(data.map(keyData => [
                keyData.keycode, keyData
            ]))
    } catch(err) {
        console.error('Error reading saved data')
        console.error(err)
    }

    return history
}

async function readJsonFile(file) {
    let data = await fs.readFile(file)

    if (Buffer.isBuffer(data))
        data = data.toString()

    if (typeof data === 'string') {
        lastDataWritten = data

        data = JSON.parse(data)
    }

    return data
}

function render(data) {
    const output = Array.from(data.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([key, {count, rawcode}]) => [
            keyCode(rawcode) ?? keyCode(key), 
            count
        ])

    console.table(output)
}

function collect(event, data) {
    const { keycode } = event
    let keyData = data.get(keycode) || {
        ...event,
        count: 0
    }

    keyData.count++

    data.set(keycode, keyData)
}

async function saveData(file, data) {
    data = JSON.stringify(Array.from(data.values()))

    if (data === lastDataWritten)
        return

    try {
        await fs.writeFile(file, data)

        lastDataWritten = data
    } catch(ex) {
        console.error(ex)
    }
}
