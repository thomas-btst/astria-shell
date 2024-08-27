import { SpeakerLevel } from "windows/levels/speaker/speaker"
import { SoundIcon, soundIcons } from "./data"

const audio = await Service.import('audio')

export const soundVolume = audio.speaker.bind('volume').as(volume => volume < 0 ? 0 : volume * 100)

const getIconBinding = (icon: SoundIcon) => audio.speaker.bind('is_muted').as(isMuted => isMuted ? icon.muted : icon.normal)

export const SoundTray = () => Widget.Button({
    className: 'sound',
    cursor: 'pointer',
    onPrimaryClick: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    onSecondaryClick: () => Utils.execAsync('pavucontrol'),
    onScrollUp: () => audio.speaker.volume+=0.02,
    onScrollDown: () => audio.speaker.volume-=0.02,
    tooltipText: soundVolume.as(volume => `${Math.trunc(volume)}%`),
    child: Widget.Stack({
        transition: 'crossfade',
        transitionDuration: 500,
        children: Object.assign(
            {},
            ...Object.entries(soundIcons).map(icon => ({[icon[0]]: Widget.Label({
                    label: getIconBinding(icon[1])
                })
            }))
        ),
        shown: audio.speaker.bind('id').as(id => id === 1 ? 'default' : 'headphones'),
    })
})