import { Cursor } from "../../../../utils/gtk"
import { Accessor } from "ags"
import { MenuItems } from "./items/MenuItems"
import { MenuPopup } from "./menu-popup/MenuPopup"

export function MenuModule() {
    return (
        <menubutton class="menu" cursor={Cursor.POINTER}>
            <MenuItems />
            <popover><MenuPopup /></popover>
        </menubutton>
    )
}