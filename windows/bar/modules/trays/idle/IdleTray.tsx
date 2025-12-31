import { IdleDaemon } from "../../../../../daemons/idle"
import { Env } from "../../../../../utils/env"
import { Cursor } from "../../../../../utils/gtk"
import { TrayItem } from "../TraysModule"

export const IdleTray: TrayItem = {
    status: IdleDaemon.state((state) => (state ? TrayItem.Status.Collapsed : TrayItem.Status.Visible)),
    Tray() {
        return (
            <button
                class="idle"
                cursor={Cursor.POINTER}
                onClicked={() => {
                    if (IdleDaemon.state.get()) IdleDaemon.stop()
                    else IdleDaemon.start()
                }}
                tooltipText={IdleDaemon.state(
                    (state) => `${state ? "Désactiver" : "Activer"} le verrouillage automatique`,
                )}
            >
                <image
                    iconName={IdleDaemon.state((state) => `changes-${state ? "prevent" : "allow"}-symbolic`)}
                    pixelSize={IdleDaemon.state((state) => (state ? Env.iconSize : Env.iconSize - 1))}
                />
            </button>
        )
    },
}
