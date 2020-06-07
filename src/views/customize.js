const { remote, remote: { dialog }, ipcRenderer } = require('electron')
const path = require('path')
const os = require('os')

module.exports = {
    render() {
        const pathElement = document.getElementById('path')
        pathElement.value = path.resolve(os.homedir(), 'AppData', 'Local')

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

            ipcRenderer.send('settings', settings)
            window.location.href = './install.pug'
            event.preventDefault()
        })
    }
}