import { AudioEndpointMenuItem } from "../AudioEndpointMenuItem"
import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding } from "ags"
import { Utils } from "../../../../../../../utils/utils"

const wp = AstalWp.get_default()

const microphone = createBinding(wp, "defaultMicrophone")

const icon = microphone((micro) => createBinding(micro, "volumeIcon"))

export const MicrophoneMenuItem = AudioEndpointMenuItem({
    class: "microphone",
    endpoint: microphone,
    icon: Utils.unnestBinding(icon),
})
