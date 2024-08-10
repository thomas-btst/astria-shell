import { Battery } from "types/service/battery"
import { BatteryState, getBatteryState } from "windows/bar/modules/tray/battery/battery"

const battery = await Service.import('battery')
const notifications = await Service.import('notifications')

enum BatteryDaemonState {
    ALMOST_FULL = 'almost_full',
    VERY_LOW = 'very_low',
}

export const BatteryDaemon = () => {

    let state: BatteryState | BatteryDaemonState = BatteryState.DISCHARGING
    let id: number | null = null

    function daemon(bat: Battery){
        async function sendNotif(summary: string) {
            id = await Utils.notify({
                iconName: bat.icon_name,
                summary
            })
        }

        let newState: BatteryState | BatteryDaemonState = getBatteryState(bat.charging, bat.percent, bat.charged)

        if (newState === BatteryState.CHARGING && bat.percent >= 85)
            newState = BatteryDaemonState.ALMOST_FULL
        else if (newState === BatteryState.LOW && bat.percent <= 10)
            newState = BatteryDaemonState.VERY_LOW

        if (state === newState)
            return

        if (id !== null)
            notifications.popups.find(popup => popup.id === id)?.dismiss()

        switch (newState) {
            case BatteryState.FULL: {
                sendNotif('Batterie pleine')
                break
            }
            case BatteryDaemonState.ALMOST_FULL: {
                sendNotif(`Batterie bientôt pleine: ${bat.percent}%`)
                break
            }
            case BatteryState.LOW: {
                sendNotif(`Batterie faible: ${bat.percent}%`)
                break
            }
            case BatteryDaemonState.VERY_LOW: {
                sendNotif(`Batterie très faible: ${bat.percent}%`)
                break
            }
            default: {
                id = null
            }
        }
        
        state = newState
    }

    daemon(battery)
    battery.connect('changed', daemon)
}