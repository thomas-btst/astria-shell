import { Gtk } from "ags/gtk4"
import { Battery as BatteryService } from "../../../../../../../services/battery_service"
import { Env } from "../../../../../../../utils/env"
import { createBinding } from "ags"
import AstalBattery from "gi://AstalBattery?version=0.1"

export function Battery() {
    const myBattery = BatteryService.get_default()
    const battery = AstalBattery.get_default()

    const percent = createBinding(myBattery, "percent")

    const level = percent((percent) => `${percent.toString()}%`)

    const icon = createBinding(battery, "iconName")

    const timeToEmptyOrFull = createBinding(myBattery, "timeToEmptyOrFull")

    return <box>
        <image iconName={icon} pixelSize={Env.iconSize} />
        <box orientation={Gtk.Orientation.VERTICAL}>
            <label label={level} />
            <label label={timeToEmptyOrFull} />
        </box>
    </box>
}