import { Panel } from "windows/panel/panel";

export const SettingsModule = () => Widget.Button({
    className: 'manager',
    cursor: 'pointer',
    onClicked: () => App.toggleWindow(Panel.name),
    child: Widget.Label({
        label: ''
    }),
})