const remote = require('electron').remote

module.exports = {
    render() {
        document.getElementById('close').addEventListener('click', event => remote.getCurrentWindow().close())
    }
}