import { SideBox, withDigits } from "utils/utils";
import { Item } from "../items";
import Gtk from 'gi://Gtk?version=3.0';
import { Notification as Notif } from "types/service/notifications";
import { addNotif, deleteNotif, NotificationPopup } from "windows/notifications/notifications";
import GLib from "types/@girs/glib-2.0/glib-2.0";

const notifications = await Service.import("notifications")

const Notification  = (n: Notif) => {
    const date = GLib.DateTime.new_from_unix_local(n.time)

    return Widget.EventBox(
        {className: 'overlay',},
        Widget.Overlay({
            child: NotificationPopup(n),
            overlays: [
                Widget.Label({
                    className: 'time',
                    hpack: 'end',
                    vpack: 'start',
                    label: `${withDigits(date.get_hour())}:${withDigits(date.get_minute())}`,
                }),
                Widget.Button({
                    className: 'close',
                    onClicked: n.close,
                    hpack: 'end',
                    vpack: 'start',
                    label: '',
                })
            ]
        })
    )
}

const Notifications = Variable<Map<number, Gtk.Widget>>(new Map(
    notifications.notifications.map(notif =>
        [notif.id, Notification(notif)]
    )
))

notifications.connect('notified', (_, id) => {
    addNotif(Notifications, id, Notification)
})

notifications.connect('closed', (_, id) => {
    deleteNotif(Notifications, id)
})

export const NotificationsItem: Item = {
    name: 'Notifications',
    icon: '',
    widget: () => Widget.Box({
        className: 'notifications',
        vertical: true,
        spacing: 15,
        children: [
            SideBox({
                classNames: ['header'],
                first: Widget.Switch({
                    vpack: 'center',
                    cursor: 'pointer',
                    active: notifications.bind('dnd').as(dnd => !dnd),
                    onActivate: ({active}) => notifications.dnd = !active
                }),
                second: Widget.Button({
                    cursor: 'pointer',
                    onClicked: () => notifications.clear(),
                    label: '',
                }),
            }),
            Widget.Box({
                className: 'body',
                vertical: true,
                spacing: 12,
                children: Notifications.bind().as(notifs => (
                    notifs.size === 0
                    ? [Widget.Label('Aucune notification')]
                    : ([...notifs.values()].reverse())
                )),
            }),
        ]
    })
}
