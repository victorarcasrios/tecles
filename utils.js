const fs = require('fs/promises')

async function readFileAsString(file) {
    const data = await fs.readFile(file)

    if (typeof data === 'string') 
        return data

    if (Buffer.isBuffer(data))
        return data.toString()

    return ""
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

module.exports = {
    collect,
    readFileAsString
}
