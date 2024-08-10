const entry = App.configDir + '/main.ts'
const outdir = '/tmp/ags/js'

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
        import(`file://${outdir}/main.js`).catch(console.error)
    } catch (error) {
        console.log("--- Compilation error ---")
        console.error(error)
    }
}

start()