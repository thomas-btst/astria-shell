import { Process, subprocess } from "ags/process"
import { Daemon } from "./daemon"
import { createState } from "ags"

const [process, setProcess] = createState<Process | null>(null)

const cmd = 'systemd-inhibit --what=idle --who="AGS" --why="Inhibit screen idle" sleep infinity'

export const IdleInhibitorDaemon: Daemon<boolean> = {
    state: process((process) => process !== null),

    start() {
        if (this.state()) return
        const process = subprocess(`sh -c '${cmd}'`)
        process.connect("exit", () => {
            setProcess(null)
        })
        setProcess(process)
    },

    stop() {
        const _process = process()
        if (!_process) return
        _process.kill()
    },
}
