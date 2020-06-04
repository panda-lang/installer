const electron = require('electron')
const { remote, remote: { dialog }, ipcRenderer } = electron

module.exports = {
    render() {
        const pathElement = document.getElementById('path')
        pathElement.value = __dirname

        document.getElementById('choose-path').addEventListener('click', event => {            
            const directory = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
                defaultPath: pathElement.value,
                properties: ['openDirectory']
            })

            if (directory != undefined) {
                pathElement.value = directory
            }
        })

        document.getElementById('install').addEventListener('click', event => {
            const settings = {
                type: document.querySelector('input[name="installation-type"]:checked').value,
                location: pathElement.value
            }

            ipcRenderer.send('set-settings', settings)
            window.location.href = './install.pug'
            event.preventDefault()
        })
    }
}