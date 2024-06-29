import { PowerMenu } from "windows/powermenu/powermenu";

export const MenuModule = () => Widget.Button({
    className: 'menu',
    cursor: 'pointer',
    onClicked: () => App.toggleWindow(PowerMenu.name),
    child: Widget.Label({
        yalign: 0.6,
        label: ''
    }),
})