import { createBinding } from "ags"
import AstalWp from "gi://AstalWp?version=0.1"
import { Level } from "../../../widgets/level/Level"
import { Speaker } from "../../../services/speaker_service"
import { Utils } from "../../../utils/utils"

const audio = AstalWp.get_default()

const speaker = createBinding(audio, "defaultSpeaker")

export const SpeakerLevel = new Level({
    name: "speaker",
    icon: createBinding(Speaker.get_default(), "icon"),
    value: Utils.unnestBinding(speaker((speaker) => createBinding(speaker, "volume"))),
    setValue(value) {
        audio.defaultSpeaker.volume = value
    },
    active: Utils.unnestBinding(speaker((speaker) => createBinding(speaker, "mute"))),
})
