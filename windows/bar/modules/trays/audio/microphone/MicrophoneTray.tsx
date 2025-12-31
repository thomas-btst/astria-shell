import AstalWp from "gi://AstalWp"
import { AudioEndpointTray } from "../AudioEndpointTray"
import { createBinding } from "ags"
import { Utils } from "../../../../../../utils/utils"

const wp = AstalWp.get_default()

const microphone = createBinding(wp, "defaultMicrophone")

const icon = microphone((micro) => createBinding(micro, "volumeIcon"))

export const MicrophoneTray = AudioEndpointTray({
    class: "microphone",
    endpoint: microphone,
    onPrimaryClick: "pavucontrol -t 4",
    icon: Utils.unnestBinding(icon),
})
