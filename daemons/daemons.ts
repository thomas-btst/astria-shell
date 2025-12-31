import { BatteryDaemon } from "./battery"
import { BrightnessDaemon } from "./brightness"
import { IdleDaemon } from "./idle"
import { MediaDaemon } from "./media"

export const StartDaemons = () => {
    BatteryDaemon()
    MediaDaemon()
    BrightnessDaemon()
    IdleDaemon.start()
}
