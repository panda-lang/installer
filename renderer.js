const remote = require('electron').remote
const win = remote.getCurrentWindow()

window.onload = () => {
    document.getElementById('minimize').addEventListener('click', event => {
        win.minimize()
    })
    document.getElementById('exit').addEventListener('click', event => {
        win.close()
    })
}