import { BatteryDaemon } from "./battery"
import { MediaDaemon } from "./media"

export const StartDaemons = () => {
    BatteryDaemon()
    MediaDaemon()
}
