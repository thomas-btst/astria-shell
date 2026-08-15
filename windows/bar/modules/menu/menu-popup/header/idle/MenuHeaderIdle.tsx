import { Idle } from "../../../../../../../services/idle_service";
import { Cursor } from "../../../../../../../utils/gtk";
import { createBinding } from "ags";
import { Utils } from "../../../../../../../utils/utils";

export function MenuHeaderIdle() {
    const idle = Idle.get_default()

    const icon = createBinding(idle, "icon")

    const enabled = createBinding(idle, "enabled")

    return (
        <button
            cssClasses={enabled((enabled) => Utils.classNames("idle", enabled && "active"))}
            onClicked={() => idle.enabled = !idle.enabled}
            cursor={Cursor.POINTER}
        >
            <image iconName={icon} />
        </button>
    )
}