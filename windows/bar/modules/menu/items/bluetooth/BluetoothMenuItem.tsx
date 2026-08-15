import AstalBluetooth from "gi://AstalBluetooth?version=0.1"
import { Env } from "../../../../../../utils/env"
import { createBinding, createComputed } from "ags"
import { Cursor } from "../../../../../../utils/gtk"
import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { MenuItem } from "../MenuItem"

const bluetooth = AstalBluetooth.get_default()

const powered = createBinding(bluetooth, "isPowered")

const connectedDevices = createBinding(
    bluetooth,
    "devices",
)((devices) => devices.map((device) => createBinding(device, "connected")))

const connectedDevicesCount = createComputed((get) => {
    return get(connectedDevices)
        .map((device) => get(device))
        .filter((connected) => connected).length
})

export const BluetoothMenuItem: MenuItem.Props = {
    visible: powered, // TODO hide if bluetooth manager is not available
    Item: () => (
        <image
            class="bluetooth"
            tooltipText={connectedDevicesCount((count) => {
                const plurial = count > 1 ? "s" : ""
                return `${count === 0 ? "Aucun" : count.toString()} appareil${plurial} connecté${plurial}`
            })}
            iconName={powered((powered) => `bluetooth-${powered ? "active" : "disabled"}-symbolic`)}
            pixelSize={Env.iconSize - 2}
        />
    ),
}
