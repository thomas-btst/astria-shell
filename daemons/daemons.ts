import { BatteryDaemon } from "./battery"
import { BrightnessDaemon } from "./brightness"
import { MediaDaemon } from "./media"

export const StartDaemons = () => {
    BatteryDaemon()
    MediaDaemon()
    BrightnessDaemon()
}
