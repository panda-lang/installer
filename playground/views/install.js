const Vivus = require('vivus')
const electron = require('electron')
const { ipcRenderer } = electron

module.exports = {
    install() {
        console.log(ipcRenderer.sendSync('get-settings'))
        // 1. get data from ui
        // 2. install and update progress bar
        // 3. done
    },
    render() {
        const installProgress = document.getElementById('install-progress')

        if (!installProgress) {
            return
        }
        const loading = document.getElementById('loading')
        let toggle = 0

        setInterval(() => {
            if (toggle > 3) {
                toggle = 0
            }

            loading.innerHTML = ({
                0: "|",
                1: "\\",
                2: "|",
                3: "/"
            })[toggle++]
        }, 350)

        const duration = 3000

        const vivus = new Vivus('install-progress', {
            file: '../assets/images/panda.svg',
            //start: 'autostart', 
            type: 'delayed',
            duration,
            animTimingFunction: Vivus.EASE_OUT
        }, panda => {
            //panda.el.classList.add('finished')
        })

        let counter = 0

        setInterval(() => {
            vivus.milestone = counter++
            vivus.play()
        }, 25)

        setTimeout(() => {
            document.querySelector('#install-progress svg').classList.add('finished')
        }, 12000)
    }
}