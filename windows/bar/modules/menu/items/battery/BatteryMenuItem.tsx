import { createBinding, createComputed } from "ags"
import AstalBattery from "gi://AstalBattery?version=0.1"
import { Utils } from "../../../../../../utils/utils"
import { Env } from "../../../../../../utils/env"
import { Battery } from "../../../../../../services/battery_service"
import { MenuItem } from "../MenuItem"

const battery = AstalBattery.get_default()
const myBattery = Battery.get_default()

export const BatteryMenuItem: MenuItem.Props = {
    visible: createBinding(
        battery,
        "isBattery",
    ),
    Item() {
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

        const timeToEmptyOrFull = createBinding(myBattery, "timeToEmptyOrFull")

        return (
            <button
                class="battery"
                tooltipText={timeToEmptyOrFull}
            >
                <box class={state} spacing={5}>
                    <image iconName={createBinding(battery, "iconName")} pixelSize={Env.iconSize} />
                    <label label={level} />
                </box>
            </button>
        )
    },
}
