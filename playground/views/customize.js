const remote = require('electron').remote
const { dialog } = remote

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
            event.preventDefault()
            window.location.href = './install.pug';
        })
    }
}