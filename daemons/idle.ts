import { execAsync } from "ags/process"
import { Daemon } from "./daemon"
import { createState } from "ags"

const program = "hypridle"
const [state, setState] = createState(false)

const waitProgram = `PID=$(pidof ${program}); [[ $PID ]] && tail --pid=$PID -f /dev/null`

export const IdleDaemon: Daemon<boolean> = {
    state,

    start() {
        if (this.state.get()) return
        setState(true)
        execAsync(`sh -c '${waitProgram} || ${program}'`)
            .catch(() => {})
            .finally(() => {
                setState(false)
            })
    },

    stop() {
        if (!this.state.get()) return
        void execAsync(`pkill ${program}`)
    },
}
