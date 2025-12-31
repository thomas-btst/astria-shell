import app from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./windows/bar/Bar"
import { PowerMenu } from "./windows/powermenu/Powermenu"
import { Levels } from "./windows/levels/levels"
import { StartDaemons } from "./daemons/daemons"
import NotificationPopups from "./windows/notifications/NotificationPopups"
import { requestHandler } from "./request"

app.start({
    css: style,
    icons: `${SRC}/icons`,
    iconTheme: "MoreWaita",
    main() {
        Bar()
        PowerMenu.Window()
        Levels.forEach((level) => level.Window())
        NotificationPopups()

        StartDaemons()
    },
    requestHandler,
})
