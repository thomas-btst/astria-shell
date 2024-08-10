import { Level } from "../level";

const audio = await Service.import('audio')

export const MicrophoneLevel = new Level({
    name: 'microphone',
    icon: audio.microphone.bind('is_muted').as(isMuted => isMuted ? "" : ""),
    value: audio.microphone.bind('volume').as(volume => volume < 0 ? 0 : volume),
    set: value => audio.microphone.volume = value,
    onClicked: () => audio.microphone.is_muted = !audio.microphone.is_muted,
})