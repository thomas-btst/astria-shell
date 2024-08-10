import { Item } from "windows/panel/items/items"
import { BackgroundChooser } from "./background/background"
import { ThemeChooser } from "./theme/theme"

export const CustomizationSection: Item = {
    name: 'Personnalisation',
    icon: '',
    widget: () => Widget.Box({
        vertical: true,
        spacing: 10,
        children: [
            BackgroundChooser(),
            ThemeChooser(),
        ],
    }),
}