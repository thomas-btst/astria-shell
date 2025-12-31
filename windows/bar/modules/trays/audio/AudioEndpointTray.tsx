import { Accessor, createBinding } from "ags"
import AstalWp from "gi://AstalWp"
import { TrayItem } from "../TraysModule"
import { Cursor } from "../../../../../utils/gtk"
import { Gtk } from "ags/gtk4"
import { Utils } from "../../../../../utils/utils"
import { Env } from "../../../../../utils/env"
import { execAsync } from "ags/process"

interface AudioEndpointTrayProps {
    class: string
    endpoint: Accessor<AstalWp.Endpoint>
    onPrimaryClick: string
    icon: Accessor<string>
}

export function AudioEndpointTray({
    class: className,
    endpoint,
    onPrimaryClick,
    icon,
}: AudioEndpointTrayProps): TrayItem {
    const muted = Utils.unnestBinding(endpoint((endpoint) => createBinding(endpoint, "mute")))
    const volume = Utils.unnestBinding(
        endpoint((endpoint) => createBinding(endpoint, "volume")((volume) => (volume < 0 ? 0 : volume * 100))),
    )

    return {
        status: muted((isMuted) => (isMuted ? TrayItem.Status.Collapsed : TrayItem.Status.Visible)),
        Tray: () => (
            <box
                class={className}
                cursor={Cursor.POINTER}
                tooltipText={volume.as((volume) => `${Math.trunc(volume).toString()}%`)}
            >
                <image iconName={icon} pixelSize={Env.iconSize - 1} />
                <Gtk.GestureClick
                    button={1}
                    onPressed={() => {
                        execAsync(onPrimaryClick).catch(console.error)
                    }}
                />
                <Gtk.GestureClick button={3} onPressed={() => (endpoint.get().mute = !endpoint.get().mute)} />
                <Gtk.EventControllerScroll
                    flags={Gtk.EventControllerScrollFlags.VERTICAL}
                    onScroll={(_, __, delta) => {
                        const _endpoint = endpoint.get()
                        const newVolume = _endpoint.volume - delta * 0.1
                        _endpoint.volume = Utils.Number.limitNumberWithinRange(newVolume, 0, 1)
                    }}
                />
            </box>
        ),
    }
}
