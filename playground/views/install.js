const Vivus = require('vivus')
const electron = require('electron')
const { ipcRenderer } = electron

const duration = 3000
const vivus = new Vivus('install-progress', {
    file: '../assets/images/panda.svg',
    type: 'delayed',
    start: 'manual',
    duration,
    animTimingFunction: Vivus.EASE_OUT
}, panda => {})

module.exports = {
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
    },
    install() {
        let started = false
        let finished = false
        
        ipcRenderer.on('progress', (event, arg) => {
            if (!started) {
                started = (arg != 0) && (arg != 1)
                return
            }
            
            if (arg === 'done') {
                window.location.href = './done.pug'
                return
            }

            if (arg === 'error') {
                return
            }

            vivus.milestone = (duration * arg) * 2
            vivus.play()

            if (!finished && (arg > 0.7)) {
                finished = true
                document.querySelector('#install-progress svg').classList.add('finished')
            }
        })
        
        ipcRenderer.send('install')
    }
}