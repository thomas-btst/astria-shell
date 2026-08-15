import { Accessor, createBinding, createComputed, For, onCleanup } from "ags"
import { Gtk } from "ags/gtk4"
import { Cursor } from "../../../../utils/gtk"
import { Env } from "../../../../utils/env"
import AstalTray from "gi://AstalTray?version=0.1"

function TrayItem({ tray }: { tray: AstalTray.TrayItem }) {
    return (
        <menubutton
            cursor={Cursor.POINTER}
            $={(self) => {
                self.menuModel = tray.menuModel
                self.insert_action_group("dbusmenu", tray.actionGroup)
                const connectionId = tray.connect("notify::action-group", () => {
                    self.insert_action_group("dbusmenu", tray.actionGroup)
                })
                onCleanup(() => {
                    tray.disconnect(connectionId)
                })
            }}
            class="item"
        >
            <image gicon={createBinding(tray, "gicon")} pixelSize={Env.iconSize} />
        </menubutton>
    )
}

export function TrayModule() {
    const tray = AstalTray.get_default()

    const items = createBinding(tray, "items")

    return (
        <menubutton class="tray" cursor={Cursor.POINTER} valign={Gtk.Align.FILL}>
            <image iconName="pan-down-symbolic" pixelSize={Env.iconSize - 2} />
            <popover>
                <Gtk.FlowBox
                    maxChildrenPerLine={5}
                    minChildrenPerLine={5}
                    selectionMode={Gtk.SelectionMode.SINGLE}
                >
                    <For each={items}>{(tray) => <TrayItem tray={tray} />}</For>
                </Gtk.FlowBox>
            </popover>
        </menubutton>
    )
}
// TODO finish to customize tray end buble

