import { BatteryTray } from "./battery/battery";
import { BoxTray } from "./box/box";
import { BrightnessTray } from "./brightness/brightness";
import { NetworkTray } from "./network/network";
import { SoundTray } from "./sound/sound";

export const TrayModule = () => Widget.Box({
    className: 'tray',
    spacing: 14,
    children: [
        BoxTray(),
        BatteryTray(),
        BrightnessTray(),
        SoundTray(),
        NetworkTray(),
    ]
})