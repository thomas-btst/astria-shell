import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./windows/bar/Bar"
import { createBinding, For, This } from "ags"
import { PowerMenu } from "./windows/powermenu/Powermenu"
import { Levels } from "./windows/levels/levels"
import { StartDaemons } from "./daemons/daemons"
import NotificationPopups from "./windows/notifications/NotificationPopups"
import { requestHandler } from "./request"

app.start({
    css: style,
    icons: `${SRC}/icons`,
    main() {
        const monitors = createBinding(app, "monitors")

        StartDaemons()

        PowerMenu.Window()
        Levels.forEach((level) => level.Window())
        NotificationPopups()

        return (
            <For each={monitors}>
                {(monitor) => (
                    <This this={app}>
                        <Bar monitor={monitor} />
                    </This>
                )}
            </For>
        )
    },
    requestHandler,
})
