import { Astal, Gdk, Gtk } from "ags/gtk4"
import { WindowOverlay } from "../../widgets/WindowOverlay"
import { createState } from "ags"
import { Cursor } from "../../utils/gtk"
import { execAsync } from "ags/process"
import { Utils } from "../../utils/utils"
import app from "ags/gtk4/app"

interface PowerButtonProps {
    iconName: string
    cmd: string
    class: string
    index: number
}

const actions = Array<[string, string, string]>(
    ["system-shutdown-symbolic", "systemctl poweroff", "poweroff"],
    ["system-reboot-symbolic", "systemctl reboot", "reboot"],
    ["application-exit-symbolic", "loginctl terminate-user $USER", "logout"],
    ["system-lock-screen-symbolic", "loginctl lock-session", "lock"],
    ["weather-clear-night-symbolic", "systemctl suspend", "suspend"],
).map((action) => ({
    iconName: action[0],
    cmd: action[1],
    class: action[2],
}))

const [selected, setSelected] = createState<number | null>(null)

function updateSelected(index: number | null) {
    setSelected(index === null ? null : Utils.Number.modulo(index, actions.length))
}

function execCmd(cmd: string) {
    PowerMenu.close()
    execAsync(`sh -c '${cmd}'`).catch(console.error)
}

function dispatchKeyPress(key: number) {
    let current = selected()
    switch (key) {
        case Gdk.KEY_Up:
        case Gdk.KEY_k:
        case Gdk.KEY_Left:
        case Gdk.KEY_h: {
            if (current == null) current = 0
            else current--
            break
        }
        case Gdk.KEY_Down:
        case Gdk.KEY_j:
            if (current == null) {
                current = Math.trunc(actions.length / 2)
                break
            }
        // Intentional fallthrough
        case Gdk.KEY_Right:
        case Gdk.KEY_l: {
            if (current == null) current = actions.length - 1
            else current++
            break
        }
        case Gdk.KEY_Return: {
            execCmd(actions[current ?? 0].cmd)
            return
        }
        case Gdk.KEY_Escape: {
            PowerMenu.close()
            return
        }
        default:
            return
    }
    updateSelected(current)
}

function PowerButton({ iconName, cmd, class: className, index }: PowerButtonProps) {
    const isSelected = selected((selected) => selected === index)
    return (
        <button
            canFocus={false}
            cssClasses={isSelected((isSelected) => Utils.classNames(className, isSelected && "selected"))}
            cursor={Cursor.POINTER}
            onClicked={() => {
                execCmd(cmd)
            }}
        >
            <image iconName={iconName} pixelSize={50} />
            <Gtk.EventControllerMotion
                onMotion={() => {
                    if (PowerMenu.isNotAnimating) updateSelected(index)
                }}
            />
        </button>
    )
}

function PowerButtons() {
    return (
        <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
            {actions.map((action, index) =>
                PowerButton({
                    index,
                    ...action,
                }),
            )}
            <Gtk.EventControllerMotion
                onLeave={() => {
                    updateSelected(null)
                }}
            />
        </box>
    )
}

export const PowerMenu = new WindowOverlay({
    class: "powermenu",
    anchor: Astal.WindowAnchor.LEFT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM,
    layer: Astal.Layer.OVERLAY,
    exclusivity: Astal.Exclusivity.IGNORE,
    keymode: Astal.Keymode.EXCLUSIVE,
    application: app,
    onKeyPressed: (_, key) => {
        dispatchKeyPress(key)
    },
    onWindowClose: () => {
        updateSelected(null)
    },
    revealer: {
        transitionType: Gtk.RevealerTransitionType.CROSSFADE,
        transitionDuration: 350,
    },
    children: () => (
        <>
            <box class="background" halign={Gtk.Align.FILL} valign={Gtk.Align.FILL} homogeneous>
                <PowerButtons />
            </box>
            <Gtk.GestureClick
                button={0}
                onPressed={() => {
                    PowerMenu.close()
                }}
            />
        </>
    ),
})
