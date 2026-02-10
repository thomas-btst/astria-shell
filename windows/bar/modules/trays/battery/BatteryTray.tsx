import { createBinding, createComputed } from "ags"
import AstalBattery from "gi://AstalBattery"
import { Utils } from "../../../../../utils/utils"
import { Cursor } from "../../../../../utils/gtk"
import { execAsync } from "ags/process"
import { Env } from "../../../../../utils/env"
import { TrayItem } from "../TraysModule"
import { Battery } from "../../../../../services/battery_service"

const battery = AstalBattery.get_default()
const myBattery = Battery.get_default()

export const BatteryTray: TrayItem = {
    status: createBinding(
        battery,
        "isBattery",
    )((isBattery) => (isBattery ? TrayItem.Status.Visible : TrayItem.Status.Hidden)),
    Tray() {
        const state = createBinding(
            myBattery,
            "state",
        )((state) => {
            switch (state) {
                case Battery.State.ALMOST_FULL:
                    return Battery.State.CHARGING
                case Battery.State.VERY_LOW:
                case Battery.State.VERY_VERY_LOW:
                    return Battery.State.LOW
                default:
                    return state
            }
        })

        const percent = createBinding(myBattery, "percent")

        const level = createComputed((get) =>
            get(state) == Battery.State.FULL ? "Plein" : `${get(percent).toString()}%`,
        )
        const timeToFull = createBinding(battery, "timeToFull")
        const timeToEmpty = createBinding(battery, "timeToEmpty")
        const batteryTimeTo = createComputed((get) => {
            const seconds = Math.max(get(timeToFull), get(timeToEmpty))
            const totalMinutes = Math.trunc(seconds / 60)
            const minutes = totalMinutes % 60
            const hours = Math.trunc(totalMinutes / 60)
            return `${Utils.Number.withDigits(hours)}:${Utils.Number.withDigits(minutes)}`
        })
        return (
            <button
                class="battery"
                cursor={Cursor.POINTER}
                onClicked={() => {
                    execAsync(
                        "hyprctl dispatch 'exec [float on; size 1000 600]' 'xdg-terminal-exec --hold btop'",
                    ).catch(console.error)
                }}
                tooltipText={batteryTimeTo}
            >
                <box class={state} spacing={5}>
                    <image iconName={createBinding(battery, "iconName")} pixelSize={Env.iconSize} />
                    <label label={level} />
                </box>
            </button>
        )
    },
}
