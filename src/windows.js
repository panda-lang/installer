const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')

const { exec } = require("child_process")
const regedit = require('regedit')
regedit.setExternalVBSLocation('resources/regedit/vbs')

const stream = require('stream')
const { promisify } = require('util')
const got = require('got')
const pipeline = promisify(stream.pipeline)

const adoptOpenJDK = 'https://github.com/AdoptOpenJDK/openjdk14-binaries/releases/download/jdk-14.0.1%2B7.1_openj9-0.20.0/OpenJDK14U-jre_x64_windows_openj9_14.0.1_7_openj9-0.20.0.zip'
const pandaRepository = 'https://repo.panda-lang.org/releases/org/panda-lang/panda'

const toEntry = (type, value) => {
    return {
        type,
        value
    }
}

const toText = value => toEntry('REG_SZ', value)
const toDefault = value => toEntry('REG_DEFAULT', value)

module.exports = {
    install(settings, event) {
        (async () => {
            event.reply('progress', 0.2)
            const directory = path.resolve(settings.location, 'panda-lang')

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory)
            }

            const jreArchive = path.resolve(directory, 'jre14.zip')
            const jvmDirectory = path.resolve(directory, 'jvm')
            const pandaDirectory = path.resolve(directory, 'panda')
            
            if (!fs.existsSync(jvmDirectory)) {
                fs.mkdirSync(jvmDirectory)
            }

            if (!fs.existsSync(pandaDirectory)) {
                fs.mkdirSync(pandaDirectory)
            }

            event.reply('progress', 0.3)
            const logoFile = path.resolve(directory, 'logo.ico')
            fs.copyFileSync(path.resolve(__dirname, 'assets/images/panda.ico'), logoFile, err => { throw err })

            const adoptOpenJDKStream = got.stream(adoptOpenJDK)
            adoptOpenJDKStream.on('downloadProgress', progress => event.reply('progress', 0.3 + (progress.percent / 2)))

            await pipeline(adoptOpenJDKStream, fs.createWriteStream(jreArchive))
            fs.createReadStream(jreArchive).pipe(unzipper.Extract({ path: jvmDirectory }));
            event.reply('progress', 0.8)

            fs.unlinkSync(jreArchive)
            const versions = fs.readdirSync(jvmDirectory)
            const jreDirectory = path.resolve(jvmDirectory, versions.sort()[0])

            event.reply('progress', 0.9)
            const latest = (await got(pandaRepository + '/latest')).body
            console.log(pandaRepository + '/' + latest + '/panda-' + latest + '-all.jar')

            const pandaStream = got.stream(pandaRepository + '/' + latest + '/panda-' + latest + '-all.jar')
            const pandaFile = path.resolve(pandaDirectory, 'panda-' + latest + '-all.jar')
            await pipeline(pandaStream, fs.createWriteStream(pandaFile))
            event.reply('progress', 0.95)

            regedit.createKey([
                'HKCU\\SOFTWARE\\Panda', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\DefaultIcon', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\FileAssociations', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\MIMEAssociations', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\shell', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\shell\\open', 
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\shell\\open\\command', 
                'HKCU\\SOFTWARE\\Classes\\.panda',
                'HKCU\\SOFTWARE\\Classes\\Panda.panda',
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\DefaultIcon',
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\shell',
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\shell\\open',
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\shell\\open\\command',
            ], err => { 
                if (err != undefined) {
                    throw err
                } 
            })

            const command = '"' + jreDirectory + '\\bin\\javaw.exe" -Xquickstart -jar "' + pandaFile + '" "%1"'

            regedit.putValue({
                'HKCU\\SOFTWARE\\Panda': {
                    'Company': toText('panda-lang'),
                    'Version': toText(latest)
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities': {
                    'ApplicationDescription': toText('Panda ' + latest),
                    'ApplicationIcon': toText(logoFile),
                    'ApplicationName': toText('Panda')
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\DefaultIcon': {
                    'default': toDefault(logoFile)
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\FileAssociations': {
                    '.panda': toText('Panda.panda')
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\MIMEAssociations': {
                    'application/panda': toText('Panda.panda')
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\shell\\open': {
                    'default': toDefault('Open')
                },
                'HKCU\\SOFTWARE\\Panda\\Capabilities\\shell\\open\\command': {
                    'default': toDefault(command)
                },
                'HKCU\\SOFTWARE\\Classes\\.panda': {
                    'default': toDefault('Panda.panda'),
                    'Content Type': toText('application/panda')
                },
                'HKCU\\SOFTWARE\\Classes\\Panda.panda': {
                    'default:': toDefault('Panda file')
                },
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\DefaultIcon': {
                    'default': toDefault(logoFile)
                },
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\shell\\open': {
                    'default': toDefault('Open') 
                },
                'HKCU\\SOFTWARE\\Classes\\Panda.panda\\shell\\open\\command': {
                    'default': toDefault(command)
                }
            }, err => { 
                if (err != undefined) {
                    throw err 
                }
            })

            event.reply('progress', 1)

            exec('ie4uinit.exe -show', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`)
                    return
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                    return
                }
                
                console.log(`stdout: ${stdout}`)
            })

            setTimeout(() => event.reply('progress', 'done'), 4000) // :)
        })()
    }
}