import { createComputed, createState, With } from "ags"
import { Gtk } from "ags/gtk4"
import { subprocess } from "ags/process"
import Apps from "gi://AstalApps?version=0.1"
import { Cursor } from "../../../../utils/gtk"
import { Env } from "../../../../utils/env"
import { Utils } from "../../../../utils/utils"
import { DesktopManager } from "../../../../services/desktop_manager/desktop_manager_service"
import { DesktopManagerInterface } from "../../../../services/desktop_manager/desktop_manager_interface"

export function WindowInfoModule() {
    const apps = new Apps.Apps()

    const desktopManager = DesktopManager.get_default()

    const [revealIcon, setRevealIcon] = createState(false) //?TODO always display the icon

    const className = desktopManager.focusedClient((client: DesktopManagerInterface.Client | null) => client?.className)

    const windowProps = createComputed((get) => {
        const _className = get(className)
        if (!_className)
            return {
                title: "Bureau",
                icon: "computer",
            }
        const app =
            apps.list.find((app) => app.wmClass === _className) ??
            apps.list.find((app) => Utils.compareStringsCaseInsensitive(app.wmClass, _className)) ??
            apps.list.find((app) => app.name === _className) ??
            apps.list.find((app) => Utils.compareStringsCaseInsensitive(app.name, _className)) ??
            apps.list.find((app) => Utils.compareStringsCaseInsensitive(app.iconName, _className)) ??
            apps.list.find((app) => app.iconName === _className)
        return {
            title: Utils.capitalize(app?.name ?? _className),
            icon: app?.iconName ?? _className,
            isFile: app?.iconName ? Utils.fileExists(app.iconName) : false,
        }
    })

    return (
        <button class="windowInfo" onClicked={() => subprocess("wofi --fork")} cursor={Cursor.POINTER}>
            <box>
                <revealer
                    revealChild={revealIcon}
                    transitionDuration={400}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                >
                    <With value={windowProps}>
                        {({ icon, isFile }) => (
                            <image
                                iconName={isFile ? undefined : icon}
                                file={isFile ? icon : undefined}
                                pixelSize={Env.iconSize}
                            />
                        )}
                    </With>
                </revealer>
                <label maxWidthChars={30} label={windowProps((props) => props.title)} valign={Gtk.Align.CENTER}></label>
            </box>
            <Gtk.EventControllerMotion
                onEnter={() => {
                    setRevealIcon(true)
                }}
                onLeave={() => {
                    setRevealIcon(false)
                }}
            />
        </button>
    )
}
