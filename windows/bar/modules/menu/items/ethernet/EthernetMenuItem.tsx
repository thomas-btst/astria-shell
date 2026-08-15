import AstalNetwork from "gi://AstalNetwork?version=0.1"
import { Env } from "../../../../../../utils/env"
import { createBinding, createComputed } from "ags"
import { Utils } from "../../../../../../utils/utils"
import { MenuItem } from "../MenuItem"

const network = AstalNetwork.get_default()

const networkingEnabled = Utils.unnestBinding(
    createBinding(network, "client")((client) => createBinding(client, "networkingEnabled")),
)

const primary = createBinding(network, "primary")

const isEthernet = createComputed((get) => get(networkingEnabled) && get(primary) === AstalNetwork.Primary.WIRED)

export const EthernetMenuItem: MenuItem.Props = {
    visible: isEthernet,
    Item: () => <image class="ethernet" iconName="network-wired-symbolic" tooltipText="Connecté par cable" pixelSize={Env.iconSize} />,
}
