import { Gtk } from "ags/gtk4"
import { Env } from "../../../../utils/env"
import { Cursor } from "../../../../utils/gtk"
import { PowerMenu } from "../../../powermenu/Powermenu"

export function PowerMenuModule() {
    return (
        <button
            class="powermenu"
            cursor={Cursor.POINTER}
            onClicked={() => {
                PowerMenu.open()
            }}
            valign={Gtk.Align.CENTER}
        >
            <image iconName="system-shutdown-symbolic" pixelSize={Env.iconSize + 1} />
        </button>
    )
}
