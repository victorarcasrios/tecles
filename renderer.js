const ipcRenderer = require('electron').ipcRenderer
const keyCode = require('keycode')

const container = document.getElementById("main-container")

ipcRenderer.on('data', (event, data) => {
    console.log('Data received')

    container.innerHTML = ''

    const sortedData = Array.from(data.entries())
        .sort(([, a], [, b]) => b.count - a.count)

    sortedData.forEach(([key, value], i) => {
        const article = document.createElement('article')
        const keyColumn = document.createElement('section')
        keyColumn.innerHTML = keyCode(value.rawcode || value.keycode) || '<i>unknown</i>'
        const countColumn = document.createElement('section')
        countColumn.textContent = value.count
        countColumn.style.backgroundColor = getCellBackgroundColor(i)
        countColumn.style.color = getCellTextColor(i)
        const clearfix = document.createElement('br')
        clearfix.classList.add('clearfix')

        article.appendChild(keyColumn)
        article.appendChild(countColumn)
        article.appendChild(clearfix)
        container.appendChild(article)
    })
})

function getCellBackgroundColor(index) {
    if (index < 10) 
        return 'red'
    
    if (index < 25)
        return 'orange'

    if (index < 50)
        return 'yellow'

    return 'lightblue'
}

function getCellTextColor(index) {
    return index < 10 ? 'white' : 'black'
}
