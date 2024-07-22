import Gtk from "types/@girs/gtk-3.0/gtk-3.0"

import { ClockModule } from "./modules/clock/clock"
import { SeparatorModule } from "./modules/separator/separator"
import { TrayModule } from "./modules/tray/tray"
import { MenuModule } from "./modules/menu/menu"
import { WorkspacesModule } from "./modules/workspaces/workspaces"
import { WindowModule } from "./modules/window/window"
import { SettingsModule } from "./modules/settings/settings"
import { margins } from "windows/window"

const ModulesBox = (position: 'start'|'center'|'end', children: Gtk.Widget[]) => Widget.Box({
    hpack: position,
    spacing: 9,
    children: children,
})

export const Bar = (monitor: number = 0) => Widget.Window({
    name: `bar-${monitor}`,
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    layer: 'top',
    margins: [margins, margins, 0, margins],
    monitor: monitor,
    child: Widget.CenterBox({
        className: "bar",

        startWidget: ModulesBox(
            'start',
            [
                MenuModule(),
                WorkspacesModule(),
            ]
        ),

        centerWidget: ModulesBox(
            'center',
            [
                WindowModule(),
            ]
        ),
        
        endWidget: ModulesBox(
            'end',
            [
                SettingsModule(),
                TrayModule(),
                SeparatorModule(),
                ClockModule(),
            ]
        ),

    }),
})