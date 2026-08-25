import { createComputed, createState, For, onCleanup, State } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import { Notification } from "../../widgets/Notification"
import { batteryAppName } from "../../daemons/battery"
import { DesktopManager } from "../../services/desktop_manager/desktop_manager_service"

interface Notif {
    notification: AstalNotifd.Notification
    active: State<boolean>
}

const animationDuration = 130

export default function NotificationPopups() {
    const notifd = AstalNotifd.get_default()
    const desktopManager = DesktopManager.get_default()

    function toNotif(notification: AstalNotifd.Notification, active = false): Notif {
        return {
            notification,
            active: createState(active),
        }
    }

    notifd.notifications.forEach((n) => {
        if (n.appName === batteryAppName) n.dismiss()
    })

    const [notifications, setNotifications] = createState(notifd.notifications.map((n) => toNotif(n, true)))

    const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
        const notification = notifd.get_notification(id)

        if (!notification) return

        if (replaced && notifications().some((n) => n.notification.id === id)) {
            setNotifications((ns) => ns.map((n) => (n.notification.id === id ? toNotif(notification) : n)))
        } else {
            setNotifications((ns) => [toNotif(notification), ...ns])
        }
    })

    const resolvedHandler = notifd.connect("resolved", (_, id) => {
        notifications().forEach((n) => {
            if (n.notification.id === id) n.active[1](false)
        })
        setTimeout(() => {
            setNotifications((ns) => ns.filter((n) => n.notification.id !== id))
        }, animationDuration)
    })

    onCleanup(() => {
        notifd.disconnect(notifiedHandler)
        notifd.disconnect(resolvedHandler)
    })

    const fullscreen = desktopManager.focusedClient((client) => client?.isFullscreen ?? false)

    return (
        <window
            class="notifications"
            namespace="astria-notifications"
            visible={notifications((ns) => ns.length > 0)}
            anchor={Astal.WindowAnchor.TOP}
            layer={Astal.Layer.OVERLAY}
            exclusivity={fullscreen((fullscreen) => (fullscreen ? Astal.Exclusivity.IGNORE : Astal.Exclusivity.NORMAL))}
        >
            <box orientation={Gtk.Orientation.VERTICAL}>
                <For each={notifications}>
                    {({ notification, active }, index) => (
                        <revealer
                            revealChild={active[0]}
                            transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
                            transitionDuration={animationDuration}
                            onMap={() => {
                                active[1](true)
                            }}
                        >
                            <box
                                css={createComputed(
                                    (get) => `padding-top: ${get(index) === 0 && get(fullscreen) ? "13" : "7"}px;`,
                                )}
                            >
                                <Notification notification={notification} />
                            </box>
                        </revealer>
                    )}
                </For>
            </box>
        </window>
    )
}
//TODO patch error log in console on dismiss
