const ioHook = require('iohook')
const keyCode = require('keycode')
const fs = require('fs/promises')

const file = './data.json'
const saveIntervalInSeconds = 10

let lastDataWritten = null

console.log('Loading...')

readData(file).then(data => {
    console.log('Ready')

    ioHook.on('keydown', (event) => {
        collect(event, data)

        console.clear()
        console.log(event)

        render(data)
    })

    ioHook.start(false)

    setInterval(() => saveData(file, data), saveIntervalInSeconds * 1000) 
})

async function readData(file) {
    let history = new Map()

    try {
        let data = await fs.readFile(file)

        if (Buffer.isBuffer(data))
            data = data.toString()

        if (typeof data === 'string') {
            lastDataWritten = data

            data = JSON.parse(data)

            if (data.length)
                history = new Map(data.map(keyData => [keyData.keycode, keyData]))
        }
    } catch(err) {
        console.error('Error reading saved data')
        console.error(err)
    }

    return history
}

function render(data) {
    const output = Array.from(data.entries())
        .sort(([, a], [, b]) => b.count - a.count)
        .map(([key, {count, rawcode}]) => [keyCode(rawcode), count])

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
