import { Settings } from "windows/settings/settings";

export const SettingsModule = () => Widget.Button({
    className: 'settings',
    cursor: 'pointer',
    onClicked: () => App.toggleWindow(Settings.name),
    child: Widget.Label({
        label: ''
    }),
})