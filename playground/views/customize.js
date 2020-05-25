const remote = require('electron').remote
const { dialog } = remote

module.exports = {
    render() {
        const pathElement = document.getElementById('path')
        pathElement.value = __dirname

        document.getElementById('choose-path').addEventListener('click', event => {
            event.preventDefault()
            
            const directory = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
                defaultPath: pathElement.value,
                properties: ['openDirectory']
            })

            console.log(directory)

            if (directory === undefined) {
                return
            }

            pathElement.value = directory
        })

        document.getElementById('install').addEventListener('click', event => {
            event.preventDefault()
            window.location.href = './install.pug';
        })
    }
}