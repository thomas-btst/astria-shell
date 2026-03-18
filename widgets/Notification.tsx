import { Gdk, Gtk } from "ags/gtk4"
import AstalNotifd from "gi://AstalNotifd?version=0.1"
import Adw from "gi://Adw?version=1"
import GLib from "gi://GLib?version=2.0"
import Pango from "gi://Pango?version=1.0"
import { Cursor } from "../utils/gtk"
import { Utils } from "../utils/utils"

interface NotificationProps {
    notification: AstalNotifd.Notification
}

export function Notification({ notification: n }: NotificationProps) {
    function isIcon(icon?: string | null): boolean {
        const display = Gdk.Display.get_default()
        if (!display) return false
        const iconTheme = Gtk.IconTheme.get_for_display(display)
        return icon !== null && icon !== undefined && iconTheme.has_icon(icon)
    }

    function time(time: number, format = "%H:%M") {
        return GLib.DateTime.new_from_unix_local(time).format(format)
    }

    function urgency(n: AstalNotifd.Notification) {
        const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency
        switch (n.urgency) {
            case LOW:
                return "low"
            case CRITICAL:
                return "critical"
            case NORMAL:
            default:
                return "normal"
        }
    }

    return (
        <Adw.Clamp maximumSize={400}>
            <box widthRequest={400} class={`Notification ${urgency(n)}`} orientation={Gtk.Orientation.VERTICAL}>
                <box class="header">
                    <image
                        class="app-icon"
                        iconName={
                            n.appIcon || (isIcon(n.desktopEntry) ? n.desktopEntry : "dialog-information-symbolic")
                        }
                    />
                    <label
                        class="app-name"
                        halign={Gtk.Align.FILL}
                        ellipsize={Pango.EllipsizeMode.END}
                        label={n.appName || "Unknown"}
                    />
                    <label class="time" hexpand halign={Gtk.Align.END} label={time(n.time) ?? undefined} />
                    <button
                        onClicked={() => {
                            n.dismiss()
                        }}
                    >
                        <image iconName="window-close-symbolic" />
                    </button>
                </box>
                <Gtk.Separator visible />
                <box class="content">
                    {n.image && Utils.fileExists(n.image) && (
                        <image valign={Gtk.Align.START} class="image" file={n.image} />
                    )}
                    {n.image && isIcon(n.image) && (
                        <box valign={Gtk.Align.START} class="icon-image">
                            <image iconName={n.image} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
                        </box>
                    )}
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <label
                            class="summary"
                            halign={Gtk.Align.FILL}
                            xalign={0}
                            label={n.summary}
                            ellipsize={Pango.EllipsizeMode.END}
                        />
                        {n.body && (
                            <label
                                class="body"
                                wrap
                                useMarkup
                                halign={Gtk.Align.FILL}
                                xalign={0}
                                justify={Gtk.Justification.FILL}
                                label={Utils.truncateString(n.body, 200)}
                            />
                        )}
                    </box>
                </box>
                {n.actions.length > 0 && (
                    <box class="actions">
                        {n.actions.map(({ label, id }) => (
                            <label label={label} halign={Gtk.Align.FILL} hexpand cursor={Cursor.POINTER}>
                                <Gtk.GestureClick
                                    onBegin={(self) => {
                                        self.set_state(Gtk.EventSequenceState.CLAIMED)
                                        n.invoke(id)
                                    }}
                                />
                            </label>
                        ))}
                    </box>
                )}
                <Gtk.GestureClick
                    onBegin={() => {
                        n.dismiss()
                    }}
                />
            </box>
        </Adw.Clamp>
    )
}
// TODO customize
