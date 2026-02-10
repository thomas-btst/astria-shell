import AstalBattery from "gi://AstalBattery"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import { Battery } from "../services/battery_service"
import { Utils } from "../utils/utils"

const battery = AstalBattery.get_default()
const myBattery = Battery.get_default()
const notifications = AstalNotifd.get_default()

export const batteryAppName = "Batterie"

export const BatteryDaemon = () => {
    let lastId: number | null = null

    function daemon() {
        function clearNotif() {
            if (lastId !== null) notifications.notifications.find((notif) => notif.id === lastId)?.dismiss()
            lastId = null
        }

        function sendNotif(summary: string) {
            clearNotif()
            Utils.notify({ appName: batteryAppName, icon: battery.iconName, summary })
                .then((id) => {
                    lastId = +id
                })
                .catch(console.error)
        }

        switch (myBattery.state) {
            case Battery.State.FULL: {
                sendNotif("Batterie pleine")
                break
            }
            case Battery.State.ALMOST_FULL: {
                sendNotif(`Batterie bientôt pleine: ${myBattery.percent.toString()}%`)
                break
            }
            case Battery.State.LOW: {
                sendNotif(`Batterie faible: ${myBattery.percent.toString()}%`)
                break
            }
            case Battery.State.VERY_LOW:
            case Battery.State.VERY_VERY_LOW: {
                sendNotif(`Batterie très faible: ${myBattery.percent.toString()}%`)
                break
            }
            default: {
                clearNotif()
            }
        }
    }

    daemon()
    myBattery.connect("notify::state", () => {
        daemon()
    })
}
