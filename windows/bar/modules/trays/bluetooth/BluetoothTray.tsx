import AstalBluetooth from "gi://AstalBluetooth"
import { Env } from "../../../../../utils/env"
import { createBinding, createComputed } from "ags"
import { TrayItem } from "../TraysModule"
import { Cursor } from "../../../../../utils/gtk"
import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"

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

export const BluetoothTray: TrayItem = {
    status: powered((powered) => (powered ? TrayItem.Status.Visible : TrayItem.Status.Collapsed)),
    Tray: () => (
        <image
            class="bluetooth"
            cursor={Cursor.POINTER}
            tooltipText={connectedDevicesCount((count) => {
                const plurial = count > 1 ? "s" : ""
                return `${count === 0 ? "Aucun" : count.toString()} appareil${plurial} connecté${plurial}`
            })}
            iconName={powered((powered) => `bluetooth-${powered ? "active" : "disabled"}-symbolic`)}
            pixelSize={Env.iconSize - 2}
        >
            <Gtk.GestureClick
                button={1}
                onPressed={() => {
                    execAsync("blueman-manager").catch(console.error)
                }}
            />
            <Gtk.GestureClick
                button={3}
                onPressed={() => {
                    bluetooth.toggle()
                }}
            />
        </image>
    ),
}
