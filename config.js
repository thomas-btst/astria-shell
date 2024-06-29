const entry = App.configDir + '/main.ts'
const outdir = '/tmp/ags/js'

export const RestartAGS = "RESTART_AGS"

const start = () => {
    try {
        const output = Utils.exec([
            'bun', 'build', entry,
            '--outdir', outdir,
            '--external', 'resource://*',
            '--external', 'gi://*',
        ])
        console.log(`Compilation output\n${output}`)
        console.log('Application started')
        import(`file://${outdir}/main.js`).catch(restart)
    } catch (error) {
        console.log("--- Compilation error ---")
        console.error(error)
    }
}

const restart = (error) => {
    if (error != RestartAGS){
        console.error(error)
        return
    }
    console.log("--- Restart ags ---")
    console.log("après")
    console.log(error)
    start()
}

start()

// Utils.monitorFile(App.configDir, () => {start()})