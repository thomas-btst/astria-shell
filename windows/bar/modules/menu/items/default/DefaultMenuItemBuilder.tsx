import { Env } from "../../../../../../utils/env"
import { MenuItem } from "../MenuItem"
import { createComputed, Accessor } from "ags"

type DefaultMenuItemBuilderType = (items: MenuItem.Props[]) => MenuItem.Props

export const DefaultMenuItemBuilder: DefaultMenuItemBuilderType = (items): MenuItem.Props => ({
    visible: createComputed((get) => !items.map<boolean>(({ visible }) => {
        if (visible instanceof Accessor)
            return get(visible)
        return visible ?? true
    }).includes(true)),

    Item() {
        return <image class="default" iconName="open-menu-symbolic" pixelSize={Env.iconSize} />
    },
})