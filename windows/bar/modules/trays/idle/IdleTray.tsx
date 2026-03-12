import { IdleInhibitorDaemon } from "../../../../../daemons/idle"
import { Env } from "../../../../../utils/env"
import { Cursor } from "../../../../../utils/gtk"
import { TrayItem } from "../TraysModule"

export const IdleTray: TrayItem = {
    status: IdleInhibitorDaemon.state((state) => (state ? TrayItem.Status.Visible : TrayItem.Status.Collapsed)),
    Tray() {
        return (
            <button
                class="idle"
                cursor={Cursor.POINTER}
                onClicked={() => {
                    if (IdleInhibitorDaemon.state()) IdleInhibitorDaemon.stop()
                    else IdleInhibitorDaemon.start()
                }}
                tooltipText={IdleInhibitorDaemon.state(
                    (state) => `${state ? "Activer" : "Désactiver"} le verrouillage automatique`,
                )}
            >
                <image
                    iconName={IdleInhibitorDaemon.state((state) => `changes-${state ? "allow" : "prevent"}-symbolic`)}
                    pixelSize={IdleInhibitorDaemon.state((state) => (state ? Env.iconSize - 1 : Env.iconSize))}
                />
            </button>
        )
    },
}
