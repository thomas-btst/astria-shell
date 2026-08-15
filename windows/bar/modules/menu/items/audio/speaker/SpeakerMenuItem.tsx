import { AudioEndpointMenuItem } from "../AudioEndpointMenuItem"
import AstalWp from "gi://AstalWp?version=0.1"
import { createBinding } from "ags"
import { Speaker } from "../../../../../../../services/speaker_service"

const wp = AstalWp.get_default()

export const SpeakerMenuItem = AudioEndpointMenuItem({
    class: "speaker",
    endpoint: createBinding(wp, "defaultSpeaker"),
    icon: createBinding(Speaker.get_default(), "icon"),
})
