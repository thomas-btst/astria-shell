import { Accessor } from "ags"
import { Gtk } from "ags/gtk4"

export namespace MenuItem {
    export interface Props {
        visible?: Accessor<boolean> | boolean
        Item: () => JSX.Element
    }
}

export function MenuItem({ visible = true, Item }: MenuItem.Props) {
    return (
        <revealer
            revealChild={visible}
            transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
            transitionDuration={440}
        >
            <box class="item">
                <Item />
            </box>
        </revealer>
    )
}