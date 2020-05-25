const remote = require('electron').remote
const { dialog } = remote

module.exports = {
    render() {
        const pathElement = document.getElementById('path')

        if (!pathElement) {
            return
        }
        
        pathElement.value = __dirname

        pathElement.addEventListener('click', event => {
            event.preventDefault()
            
            const directory = dialog.showOpenDialogSync(remote.getCurrentWindow(), {
                defaultPath: pathElement.value,
                properties: ["openDirectory"]
            })

            console.log(directory)

            if (directory === undefined) {
                return
            }

            pathElement.value = directory
        })
    }
}