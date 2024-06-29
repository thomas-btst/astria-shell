const audio = await Service.import('audio')

const soundVolume = audio.speaker.bind('volume').as(volume => volume < 0 ? 0 : volume * 100)

export const SoundTray = () => Widget.Button({
    className: 'sound',
    cursor: 'pointer',
    onPrimaryClick: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    onSecondaryClick: () => Utils.execAsync('pavucontrol'),
    onScrollUp: () => audio.speaker.volume+=0.02,
    onScrollDown: () => audio.speaker.volume-=0.02,
    tooltipText: soundVolume.as(volume => `${Math.trunc(volume)}%`),
    child: Widget.Label({
        label: audio.speaker.bind('is_muted').as(isMuted => (isMuted ? '󰖁' : '󰕾')),
    })
})