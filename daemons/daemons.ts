import { BatteryDaemon } from "./battery"
import { BrightnessDaemon } from "./brightness"

export const StartDaemons = () => {
    BatteryDaemon()
    BrightnessDaemon()
}
