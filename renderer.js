const ipcRenderer = require('electron').ipcRenderer
const keyCode = require('keycode')

const keysDataContainer = document.getElementById("keys-data-container")
const keyboardLayoutContainer = document.getElementById("keyboard-layout-container")

ipcRenderer.on('layout', (event, layout) => {
    console.info('LAYOUT')
    console.debug(layout)

    renderLayout(keyboardLayoutContainer, layout)
})

ipcRenderer.on('data', (event, data) => {
    console.log('Data received')

    keysDataContainer.innerHTML = ''

    const sortedData = Array.from(data.entries())
        .sort(([, a], [, b]) => b.count - a.count)

	if(sortedData.length)
        renderKeysData(keysDataContainer, sortedData)
    else
		renderNoDataMessage(keysDataContainer)
})

function renderLayout(container, layout) {
    for(let section of layout) {
        const sectionElement = createSection()

        for(let rowData of section) {
            const rowElement = createRow()

            for(let key of rowData) {
                rowElement.appendChild(createKeyElement(key))
            }

            rowElement.appendChild(createClearfix())

            sectionElement.appendChild(rowElement)
        }
        sectionElement.appendChild(createClearfix())

        container.appendChild(sectionElement)
    }
    container.appendChild(createClearfix())
}

function createSection() {
    const element = document.createElement('div')
    element.classList.add('section')

    return element
}

function createKeyElement(key) {
    const element = document.createElement('div')

    if (key) {
        element.classList.add('key')
        element.textContent = key
    } else {
        element.classList.add('space')
    }

    return element
}

function createRow() {
    const element = document.createElement('div')
    element.classList.add('row')

    return element
}


function renderKeysData(container, data) {
    data.forEach(([key, value], i) => {
        const article = document.createElement('article')
        const keyColumn = document.createElement('section')
        keyColumn.innerHTML = keyCode(value.rawcode || value.keycode) 
            || '<i>unknown</i>'
        const countColumn = document.createElement('section')
        countColumn.textContent = value.count
        countColumn.style.backgroundColor = getCellBackgroundColor(i)
        countColumn.style.color = getCellTextColor(i)

        article.appendChild(keyColumn)
        article.appendChild(countColumn)
        article.appendChild(createClearfix())
        container.appendChild(article)
    })
}

function createClearfix() {
    const clearfix = document.createElement('br')
    clearfix.classList.add('clearfix')

    return clearfix
}

function renderNoDataMessage(container) {
	const paragraph1 = document.createElement('p')
	paragraph1.textContent = 'There is no keyboard data'

	const paragraph2 = document.createElement('p')
	paragraph2.textContent = 'Press any key to start'

    container.appendChild(paragraph1)
    container.appendChild(paragraph2)
}

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
