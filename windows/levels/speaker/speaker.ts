import { icons } from "windows/bar/modules/tray/sound/sound";
import { Level } from "../level";

const audio = await Service.import('audio')

const icon = Utils.merge([
    audio.speaker.bind('id'),
    audio.speaker.bind('is_muted'),
], (id: number, isMuted: boolean) => {
    const icon = id === 1 ? icons.default : icons.headphones
    return isMuted ? icon.muted : icon.normal
})

export const SpeakerLevel = new Level({
    name: 'speaker',
    icon,
    value: audio.speaker.bind('volume').as(volume => volume < 0 ? 0 : volume),
    set: value => audio.speaker.volume = value,
    onClicked: () => audio.speaker.is_muted = !audio.speaker.is_muted,
})
