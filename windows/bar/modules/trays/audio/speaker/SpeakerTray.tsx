import { AudioEndpointTray } from "../AudioEndpointTray"
import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding } from "ags"
import { Speaker } from "../../../../../../services/speaker_service"

const wp = AstalWp.get_default()

export const SpeakerTray = AudioEndpointTray({
    class: "speaker",
    endpoint: createBinding(wp, "defaultSpeaker"),
    onPrimaryClick: "pavucontrol -t 3",
    icon: createBinding(Speaker.get_default(), "icon"),
})
