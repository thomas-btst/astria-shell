import { Panel } from "windows/panel/panel";

const notifications = await Service.import('notifications')

export const SettingsModule = () => Widget.Button({
    className: notifications.bind('dnd').as(dnd => `manager ${dnd ? 'dnd' : ''}`),
    cursor: 'pointer',
    onClicked: () => Panel.toggle(),
    child: Widget.Label({
        label: notifications.bind('dnd').as(dnd => dnd ? '' : '')
    }),
})