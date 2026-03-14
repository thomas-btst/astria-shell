import { createBinding } from "ags"
import AstalWp from "gi://AstalWp?version=0.1"
import { Level } from "../../../widgets/level/Level"
import { Utils } from "../../../utils/utils"

const audio = AstalWp.get_default()

const microphone = createBinding(audio, "defaultMicrophone")

export const MicrophoneLevel = new Level({
    name: "microphone",
    icon: Utils.unnestBinding(microphone((micro) => createBinding(micro, "volumeIcon"))),
    value: Utils.unnestBinding(microphone((micro) => createBinding(micro, "volume"))),
    setValue(value) {
        audio.defaultMicrophone.volume = value
    },
    active: Utils.unnestBinding(microphone((micro) => createBinding(micro, "mute"))),
})
