import { Gtk } from "ags/gtk4";

export function MenuWidgets() {
    return (
        <box orientation={Gtk.Orientation.VERTICAL}>
            <box>
                <label label="Ceci est un label de test 1 du test tedk kf kd fkd jfk" />
                <label label="test 1" />
            </box>
            <box>
                <label label="Ceci est un label de test 1" />
                <label label="test 1" />
            </box>
        </box>
    )
}