import { Gtk } from "ags/gtk4";
import { MenuSliders } from "./sliders/MenuSliders";
import { MenuNotifications } from "./notifications/MenuNotifications";
import { MenuWidgets } from "./widgets/MenuWidgets";
import { MenuHeader } from "./header/MenuHeader";

export function MenuPopup() {
    return (
        <box
            class="menu-popup"
            orientation={Gtk.Orientation.VERTICAL}
        >
            <MenuHeader />
            <MenuWidgets />
            <MenuSliders />
            <MenuNotifications />
        </box>
    )
}