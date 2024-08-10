import { PowerMenu } from "windows/powermenu/powermenu";

export const MenuModule = () => Widget.Button({
    className: 'menu',
    cursor: 'pointer',
    onClicked: () => PowerMenu.toggle(),
    child: Widget.Label({
        yalign: 0.6,
        label: ''
    }),
})