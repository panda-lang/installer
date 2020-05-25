const remote = require('electron').remote

module.exports = {
    render() {
        const win = remote.getCurrentWindow()
        
        document.getElementById('minimize').addEventListener('click', event => win.minimize())
        document.getElementById('exit').addEventListener('click', event => win.close())
    }
}