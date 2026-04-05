import { createComputed, createState, With } from "ags"
import { Gtk } from "ags/gtk4"
import { subprocess } from "ags/process"
import Apps from "gi://AstalApps?version=0.1"
import { Cursor } from "../../../../utils/gtk"
import { Env } from "../../../../utils/env"
import { Utils } from "../../../../utils/utils"
import { DesktopManager } from "../../../../services/desktop_manager/desktop_manager_service"

export function WindowInfoModule() {
    const apps = new Apps.Apps()

    const desktopManager = DesktopManager.get_default()

    const [revealIcon, setRevealIcon] = createState(false) //?TODO always display the icon

    function findAppByProps(match: string, accessors: ((app: Apps.Application) => string)[]) {
        for (const accessProp of accessors) {
            const foundApp =
                apps.list.find((app) => accessProp(app) === match) ??
                apps.list.find((app) => Utils.compareStringsCaseInsensitive(accessProp(app), match))
            if (foundApp) return foundApp
        }
        return null
    }

    const windowProps = createComputed((get) => {
        const client = get(desktopManager.focusedClient)
        if (!client)
            return {
                title: "Bureau",
                icon: "computer",
            }
        const app =
            findAppByProps(client.className, [(app) => app.wmClass, (app) => app.name, (app) => app.iconName]) ??
            findAppByProps(client.title, [(app) => app.name])
        return {
            title: Utils.capitalize(app?.name ?? client.className),
            icon: app?.iconName ?? client.className,
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
