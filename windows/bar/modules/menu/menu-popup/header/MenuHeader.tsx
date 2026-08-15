import { Gtk } from "ags/gtk4";
import { MenuHeaderIdle } from "./idle/MenuHeaderIdle";
import { Battery } from "./battery/Battery";
import { Cursor } from "../../../../../../utils/gtk";
import { PowerMenu } from "../../../../../powermenu/Powermenu";
import { Env } from "../../../../../../utils/env";

export function MenuHeader() {
    // TODO ! batterie
    return <centerbox class="header" halign={Gtk.Align.FILL} hexpand>
        <box $type="start"><Battery /></box>
        <box $type="end" halign={Gtk.Align.END}>
            <MenuHeaderIdle />
            <button
                cursor={Cursor.POINTER}
                onClicked={() => { PowerMenu.toggle() }}
                valign={Gtk.Align.CENTER}
            >
                <image iconName="system-shutdown-symbolic" pixelSize={Env.iconSize} />
            </button>
        </box>
    </centerbox>
}
