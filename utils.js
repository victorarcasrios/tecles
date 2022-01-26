const fs = require('fs/promises')
const keyname = require('os-keycode').keyname

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
        label: keyname(keycode)?.key,
        count: 0
    }

    keyData.count++

    data.set(keycode, keyData)
}

function updateLabel(data, keycode, label) {
    let keyData = data.get(keycode)

    keyData.label = label
}

module.exports = {
    collect,
    readFileAsString,
    updateLabel
}
