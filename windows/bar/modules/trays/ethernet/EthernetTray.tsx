import AstalNetwork from "gi://AstalNetwork"
import { Env } from "../../../../../utils/env"
import { createBinding, createComputed } from "ags"
import { TrayItem } from "../TraysModule"
import { Utils } from "../../../../../utils/utils"

const network = AstalNetwork.get_default()

const networkingEnabled = Utils.unnestBinding(
    createBinding(network, "client")((client) => createBinding(client, "networkingEnabled")),
)

const primary = createBinding(network, "primary")

const isEthernet = createComputed((get) => get(networkingEnabled) && get(primary) === AstalNetwork.Primary.WIRED)

export const EthernetTray: TrayItem = {
    status: isEthernet((isEthernet) => (isEthernet ? TrayItem.Status.Visible : TrayItem.Status.Hidden)),
    Tray: () => <image class="ethernet" iconName="network-wired-symbolic" pixelSize={Env.iconSize} />,
}
