import { MicrophoneMenuItem } from "./audio/microphone/MicrophoneMenuItem"
import { SpeakerMenuItem } from "./audio/speaker/SpeakerMenuItem"
import { BatteryMenuItem } from "./battery/BatteryMenuItem"
import { BluetoothMenuItem } from "./bluetooth/BluetoothMenuItem"
import { DefaultMenuItemBuilder } from "./default/DefaultMenuItemBuilder"
import { EthernetMenuItem } from "./ethernet/EthernetMenuItem"
import { IdleMenuItem } from "./idle/IdleMenuItem"
import { MenuItem } from "./MenuItem"
import { WifiMenuItem } from "./wifi/WifiMenuItem"

export function MenuItems() {
    const items: MenuItem.Props[] = [
        BatteryMenuItem,
        IdleMenuItem,
        MicrophoneMenuItem,
        SpeakerMenuItem,
        BluetoothMenuItem,
        EthernetMenuItem,
        WifiMenuItem,
    ]

    items.push(DefaultMenuItemBuilder([...items]))

    return (
        <box class="menu-items">
            <box>
                {items.map(MenuItem)}
            </box>
        </box>
    )
}