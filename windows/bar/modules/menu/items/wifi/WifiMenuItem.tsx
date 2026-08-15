import { createBinding, createComputed } from "ags"
import AstalNetwork from "gi://AstalNetwork?version=0.1"
import { Utils } from "../../../../../../utils/utils"
import { MenuItem } from "../MenuItem"

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

export const WifiMenuItem: MenuItem.Props = {
    visible: createComputed((get) =>
        get(isWifi) && get(isPrimary),
    ), // TODO hide if networkmanager is not available
    Item() {
        const title = createComputed((get) => {
            if (!get(isWifi)) return "Désactivé"
            if (get(internet) === AstalNetwork.Internet.DISCONNECTED) return "Déconnecté"
            return `${get(ssid)} - ${get(strength).toString()}%`
        })

        return (
            <image class="wifi" iconName={iconName} pixelSize={17} tooltipText={title} />
        )
    },
} // TODO patch wifi icon bugs and null bug...
