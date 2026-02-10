import { createBinding, createComputed, createState, For, onCleanup, State } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd"
import { Notification } from "../../widgets/Notification"
import AstalHyprland from "gi://AstalHyprland"
import { Utils } from "../../utils/utils"
import { batteryAppName } from "../../daemons/battery"

interface Notif {
    notification: AstalNotifd.Notification
    active: State<boolean>
}

const animationDuration = 130
export default function NotificationPopups() {
    const notifd = AstalNotifd.get_default()
    const hyprland = AstalHyprland.get_default()

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

        if (replaced && notifications.get().some((n) => n.notification.id === id)) {
            setNotifications((ns) => ns.map((n) => (n.notification.id === id ? toNotif(notification) : n)))
        } else {
            setNotifications((ns) => [toNotif(notification), ...ns])
        }
    })

    const resolvedHandler = notifd.connect("resolved", (_, id) => {
        notifications.get().forEach((n) => {
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

    const fullscreen = Utils.unnestBinding(
        createBinding(
            hyprland,
            "focusedClient",
        )((client: AstalHyprland.Client | null) => {
            if (client)
                return createBinding(
                    client,
                    "fullscreen",
                )((fullscreen) => fullscreen === AstalHyprland.Fullscreen.FULLSCREEN)
            else return createState(false)[0]
        }),
    )

    return (
        <window
            class="notifications"
            namespace="notifications"
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
