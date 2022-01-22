const fs = require('fs/promises')
const { readFileAsString } = require('./utils')

class PersistanceService {
    lastDataWritten = null

    async readData(file) {
        try {
            const dataAsString = await readFileAsString(file)

            this.lastDataWritten = dataAsString

            const data = JSON.parse(dataAsString)

            if (!data.length)
                return new Map()

            return new Map(data.map(keyData => [keyData.keycode, keyData]))
        } catch(err) {
            console.error('Error reading saved data')
            console.error(err)
        }

        return new Map()
    }

    async saveData(file, data) {
        data = JSON.stringify(Array.from(data.values()))

        if (data === this.lastDataWritten)
            return

        try {
            await fs.writeFile(file, data)

            this.lastDataWritten = data
        } catch(ex) {
            console.error(ex)
        }
    }
}

module.exports = PersistanceService
