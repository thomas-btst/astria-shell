import { Item } from "windows/panel/items/items";

export const AccoutSection: Item = {
    name: 'Compte',
    icon: '',
    widget: () => Widget.Label({
        wrap: true,
        label: 'En cours de dev',
    })
}