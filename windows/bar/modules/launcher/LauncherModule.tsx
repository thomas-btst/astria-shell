import { Gtk } from "ags/gtk4"
import { Env } from "../../../../utils/env"
import { Cursor } from "../../../../utils/gtk"
import { execAsync } from "ags/process"

export function LauncherModule() {
    return (
        <button
            class="launcher"
            cursor={Cursor.POINTER}
            onClicked={() => { execAsync("walker") }} // TODO ! open default menu from AGS
            valign={Gtk.Align.CENTER}
        >
            <image iconName="view-grid-symbolic" pixelSize={Env.iconSize} />
        </button>
    )
}
