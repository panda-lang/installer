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

const adoptOpenJDK = 'https://github.com/AdoptOpenJDK/openjdk15-binaries/releases/download/jdk-15.0.2%2B7_openj9-0.24.0/OpenJDK15U-jre_x64_windows_openj9_15.0.2_7_openj9-0.24.0.zip'
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

            // Prepare structure
            
            const directory = path.resolve(settings.location, 'panda-lang')

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory)
            }
            
            const jreArchive = path.resolve(directory, 'jre15.zip')
            const jvmDirectory = path.resolve(directory, 'jvm')
            const pandaDirectory = path.resolve(directory, 'panda')
            
            if (!fs.existsSync(jvmDirectory)) {
                fs.mkdirSync(jvmDirectory)
            }

            if (!fs.existsSync(pandaDirectory)) {
                fs.mkdirSync(pandaDirectory)
            }

            event.reply('progress', 0.3)

            // Copy file icon

            const logoFile = path.resolve(directory, 'logo.ico')
            fs.copyFileSync(path.resolve(__dirname, 'assets/images/panda.ico'), logoFile, err => { throw err })

            // Download JVM

            const adoptOpenJDKStream = got.stream(adoptOpenJDK)
            adoptOpenJDKStream.on('downloadProgress', progress => event.reply('progress', 0.3 + (progress.percent / 2)))

            await pipeline(adoptOpenJDKStream, fs.createWriteStream(jreArchive))
            fs.createReadStream(jreArchive).pipe(unzipper.Extract({ path: jvmDirectory }));
            event.reply('progress', 0.8)

            fs.unlinkSync(jreArchive)
            const versions = fs.readdirSync(jvmDirectory)
            const jreDirectory = path.resolve(jvmDirectory, versions.sort()[0])

            event.reply('progress', 0.9)

            // Download latest version of Panda

            const latest = (await got(pandaRepository + '/latest')).body
            console.log(pandaRepository + '/' + latest + '/panda-' + latest + '-all.jar')

            const pandaStream = got.stream(pandaRepository + '/' + latest + '/panda-' + latest + '-all.jar')
            const pandaFile = path.resolve(pandaDirectory, 'panda-' + latest + '-all.jar')
            await pipeline(pandaStream, fs.createWriteStream(pandaFile))
            event.reply('progress', 0.95)

            // Prepare commands

            const commandDirectory = '"' + jreDirectory + '\\bin\\'
            const command = commandDirectory + '%target%" -Xquickstart -jar "' + pandaFile + '" %args%'

            // Add panda command to PATH

            const cmdFile = path.resolve(pandaDirectory, 'panda.cmd')
            fs.writeFileSync(cmdFile, `
            @echo off
            ${command.replace('%target%', 'java.exe').replace('%args%', '%*')}
            `)
            
            const errorHandler = err => { 
                if (err != undefined) {
                    throw err 
                }
            }

            regedit.list(['HKCU\\Environment']).on('data', function (entry) {
                const environmentPath = entry.data.values['Path'].value

                if (environmentPath && !environmentPath.includes(pandaDirectory)) {
                    regedit.putValue({
                        'HKCU\\Environment': {
                            'Path': {
                                type: 'REG_EXPAND_SZ',
                                value: environmentPath + ';' + pandaDirectory
                            }
                        }
                    }, errorHandler)
                }   
            })

            // Register Panda files in Windows Registry

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
            ], errorHandler)
            
            const openCommand = command
                .replace('%target%', 'javaw.exe')
                .replace('%args%', '"%1"')

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
                    'default': toDefault(openCommand)
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
                    'default': toDefault(openCommand)
                }
            }, errorHandler)

            event.reply('progress', 1)

            // Refresh system

            const commandHandler = (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`)
                    return
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                    return
                }
                
                console.log(`stdout: ${stdout}`)
            }

            const updatePathCommand = `
            Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
                [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
                public static extern IntPtr SendMessageTimeout(IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam, 
                                                               uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
            "@;
            [void] ([Win32.Nativemethods]::SendMessageTimeout([IntPtr] 0xFFFF, 0x1A, [UIntPtr]::Zero, "Environment", 2, 2000, [ref] [UIntPtr]::Zero))
            `
            exec(`powershell -Command '${updatePathCommand}'`)

            // End of installation

            setTimeout(() => event.reply('progress', 'done'), 4000) // :)
        })()
    }
}