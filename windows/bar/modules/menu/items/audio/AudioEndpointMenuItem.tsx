import { Accessor, createBinding } from "ags"
import AstalWp from "gi://AstalWp?version=0.1"
import { Utils } from "../../../../../../utils/utils"
import { Env } from "../../../../../../utils/env"
import { MenuItem } from "../MenuItem"

interface AudioEndpointMenuItemProps {
    class: string
    endpoint: Accessor<AstalWp.Endpoint>
    icon: Accessor<string>
}

export function AudioEndpointMenuItem({
    class: className,
    endpoint,
    icon,
}: AudioEndpointMenuItemProps): MenuItem.Props {
    const muted = Utils.unnestBinding(endpoint((endpoint) => createBinding(endpoint, "mute")))

    const volume = Utils.unnestBinding(
        endpoint((endpoint) => createBinding(endpoint, "volume")((volume) => (volume < 0 ? 0 : volume * 100))),
    )

    return {
        visible: muted((isMuted) => !isMuted), // TODO hide if no endpoint is available
        Item: () => (
            <box
                class={className}
                tooltipText={volume.as((volume) => `${Math.trunc(volume).toString()}%`)}
            >
                <image iconName={icon} pixelSize={Env.iconSize - 1} />
            </box>
        ),
    }
}
