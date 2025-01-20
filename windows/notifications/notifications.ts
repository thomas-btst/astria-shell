import { Notification as Notif } from "types/service/notifications";
import { margins, Window } from "windows/window";
import Gtk from "gi://Gtk?version=3.0";
import { Variable as Var } from "types/variable";
import cairo from "types/@girs/cairo-1.0/cairo-1.0";

const notifications = await Service.import('notifications')
const hyprland = await Service.import('hyprland')

notifications.popupTimeout = 6000

function NotificationIcon({ app_entry, app_icon, image }): Gtk.Widget {
    if (image) {
        if (Utils.lookUpIcon(image))
            return Widget.Box({
                child: Widget.Icon(image),
            })
        return Widget.Box({
            css: `background-image: url('${image}');`
                + 'background-size: contain;'
                + 'background-repeat: no-repeat;'
                + 'background-position: center;',
        })
    }

    let icon = 'dialog-information-symbolic'
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Widget.Box({
        child: Widget.Icon(icon),
    })
}

export function NotificationPopup(n: Notif) {
    const icon = Widget.Box({
        vpack: 'start',
        className: 'icon',
        child: NotificationIcon(n),
    })

    const body = ( n.body === '' ? null
        : Widget.Label({
            class_name: 'body',
            hexpand: true,
            use_markup: true,
            xalign: 0,
            justification: 'left',
            label: n.body,
            wrap: true,
        })
    )

    const title = Widget.Label({
        class_name: 'title',
        xalign: 0,
        justification: 'left',
        hexpand: true,
        max_width_chars: 24,
        truncate: body === null ? 'none' : 'end',
        wrap: true,
        label: n.summary,
        use_markup: true,
    })

    const actions = Widget.Box({
        class_name: 'actions',
        children: n.actions.map(({ id, label }) => Widget.Button({
            cursor: 'pointer',
            className: 'action-button',
            onClicked: () => {
                n.invoke(id)
                n.dismiss()
            },
            hexpand: true,
            child: Widget.Label(label),
        })),
    })

    return Widget.EventBox({
        class_name: `notification ${n.urgency}`,
        attribute: { id: n.id },
        onPrimaryClick: n.dismiss,
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box([
                    icon,
                    Widget.Box(
                        {
                            vertical: true,
                            vpack: 'center',
                            children: [
                                title
                            ].concat(body ?? [])
                        },
                    ),
                ]),
                actions,
            ]
        })
    })
}

const Notifs = Variable<Map<number, Gtk.Widget>>(new Map(
    notifications.popups.map(notif =>
        [notif.id, NotificationPopup(notif)]
    )
))

export function deleteNotif(Notifs: Var<Map<number, Gtk.Widget>>, id) {
    const notifs = Notifs.value
    notifs.delete(id)
    Notifs.setValue(notifs)
}

export function addNotif(Notifs: Var<Map<number, Gtk.Widget>>, id, createWidget: (number) => Gtk.Widget) {
    const notifs = Notifs.value
    const notif = notifications.getNotification(id)
    if(notif === undefined)
        return
    notifs.set(id, createWidget(notif))
    Notifs.setValue(notifs)
}

notifications.connect('notified', (_, id) => {
    if(notifications.dnd)
        return
    addNotif(Notifs, id, NotificationPopup)
})

notifications.connect('closed', (_, id) => {
    deleteNotif(Notifs, id)
})

notifications.connect('dismissed', (_, id) => {
    deleteNotif(Notifs, id)

})

export const Notifications = new Window('notifications',
    {
        anchor: ['top', 'right'],
        layer: 'overlay',
        exclusivity: Utils.merge([hyprland.bind('clients'), hyprland.active.bind('client')],
        (clients, client) => {
            const c = hyprland.getClient(client.address)
            if (c !== undefined && c.fullscreen && c.fullscreenMode === 0)
                return 'ignore'
            return 'normal'
        }
    ),
        margins: [margins],
        monitor: hyprland.active.monitor.bind('id'),
        visible: false,
        child: Widget.Box({
            css: 'padding: 0.1px',
            vertical: true,
            spacing: 12,
            children: Notifs.bind().as(notifs => {
                if (App.windows.find(window => window.name === Notifications.name) === undefined )
                    return [Widget.Label('window not loaded')]
                if (notifs.size === 0){
                    Notifications.close()
                    return [Widget.Label('empty')]
                }
                else{
                    Notifications.open()
                    return ([...notifs.values()])
                }
            })
        })
    }
)