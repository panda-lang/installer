const ProgressBar = require('progressbar.js/dist/progressbar')
const Vivus = require('vivus')
const remote = require('electron').remote
const { dialog } = remote;
const win = remote.getCurrentWindow()

window.onload = () => {
    document.getElementById('minimize').addEventListener('click', event => {
        win.minimize()
    })
    document.getElementById('exit').addEventListener('click', event => {
        win.close()
    })

    const pathElement = document.getElementById('path')

    if (pathElement) {
        pathElement.value = __dirname

        pathElement.addEventListener('click', event => {
            event.preventDefault()

            const directory = dialog.showOpenDialogSync(win, {
                defaultPath: pathElement.value,
                properties: [ "openDirectory" ]
            })

            console.log(directory)
            pathElement.value = directory
        })
    }

    const installProgress = document.getElementById('install-progress')

    if (installProgress) {
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
            file: './panda.svg',
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