import { createBinding, createComputed } from "ags"
import AstalNetwork from "gi://AstalNetwork"
import { Cursor } from "../../../../../utils/gtk"
import { execAsync } from "ags/process"
import { Gtk } from "ags/gtk4"
import { TrayItem } from "../TraysModule"
import { Utils } from "../../../../../utils/utils"

const network = AstalNetwork.get_default()

const wifi = createBinding(network, "wifi")

const internet = Utils.unnestBinding(wifi((wifi) => createBinding(wifi, "internet")))
const ssid = Utils.unnestBinding(wifi((wifi) => createBinding(wifi, "ssid")))
const strength = Utils.unnestBinding(wifi((wifi) => createBinding(wifi, "strength")))

const networkingEnabled = Utils.unnestBinding(
    createBinding(network, "client")((client) => createBinding(client, "networkingEnabled")),
)

const iconName = Utils.unnestBinding(wifi((wifi) => createBinding(wifi, "iconName")))

const wifiEnabled = Utils.unnestBinding(wifi((wifi) => createBinding(wifi, "enabled")))

const isWifi = createComputed((get) => get(networkingEnabled) && get(wifiEnabled))

const isPrimary = createBinding(
    network,
    "primary",
)((primary) => primary === AstalNetwork.Primary.WIFI || primary === AstalNetwork.Primary.UNKNOWN)

export const WifiTray: TrayItem = {
    status: createComputed((get) =>
        get(isWifi) && get(isPrimary) ? TrayItem.Status.Visible : TrayItem.Status.Collapsed,
    ),
    Tray() {
        const title = createComputed((get) => {
            if (!get(isWifi)) return "Désactivé"
            if (get(internet) === AstalNetwork.Internet.DISCONNECTED) return "Déconnecté"
            return `${get(ssid)} - ${get(strength).toString()}%`
        })

        return (
            <box class="wifi" cursor={Cursor.POINTER} tooltipText={title}>
                <image iconName={iconName} pixelSize={17} />
                <Gtk.GestureClick
                    button={1}
                    onPressed={() => {
                        execAsync("networkmanager_dmenu").catch(console.error)
                    }}
                />
                <Gtk.GestureClick button={3} onPressed={() => (network.wifi.enabled = !network.wifi.enabled)} />
            </box>
        )
    },
} // TODO patch wifi icon bugs and null bug...
