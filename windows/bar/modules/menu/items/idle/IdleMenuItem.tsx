import { Env } from "../../../../../../utils/env"
import { MenuItem } from "../MenuItem"
import { Idle } from "../../../../../../services/idle_service"
import { createBinding } from "ags"

const idle = Idle.get_default()

const disabled = createBinding(idle, "enabled")((enabled) => !enabled)

export const IdleMenuItem: MenuItem.Props = {
    visible: disabled,
    Item() {
        return (
            <button
                class="idle"
                tooltipText={"Verrouillage automatique désactivé"}
            >
                <image
                    iconName={createBinding(idle, "icon")}
                    pixelSize={disabled((disabled) => (disabled ? Env.iconSize - 1 : Env.iconSize))}
                />
            </button>
        )
    },
}
