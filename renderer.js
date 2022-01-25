const ipcRenderer = require('electron').ipcRenderer

const container = document.getElementById("main-container")

ipcRenderer.on('data', (event, data) => {
    console.log('Data received')

    container.innerHTML = ''

    const sortedData = Array.from(data.entries())
        .sort(([, a], [, b]) => b.count - a.count)

    sortedData.forEach(([key, value], i) => {
        const article = document.createElement('article')
        const keyColumn = createKeyColumn(value)
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

	if(!sortedData.length)
		renderNoDataMessage(container)
})

function updateKeyLabel(keycode, label) {
    ipcRenderer.invoke('update-key-label', {keycode, label})
}

function createKeyColumn({keycode, label}) {
    const element = document.createElement('section')
    if(label)
        element.innerHTML = label
    else
        element.classList.add('unknown')

    element.addEventListener('click', () => {
        if (element.querySelectorAll('input').length)
            return

        const input = document.createElement('input')
        input.type = 'text'
        input.value = element.innerHTML

        element.innerHTML = ''
        element.classList.remove('unknown')

        const controller = new AbortController
        input.addEventListener('blur', () => {
            updateKeyLabel(keycode, input.value)
            element.innerHTML = input.value

            if(!input.value)
                element.classList.add('unknown')

            input.remove()

            controller.abort()
        }, {signal: controller.signal})

        element.appendChild(input)
        input.focus()
    })

    return element
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
