const audio = await Service.import('audio')

interface Icon{
    normal: string,
    muted: string,
}

export const icons: {
    default: Icon,
    headphones: Icon,
} = {
    default: {
        normal: '󰕾',
        muted: '󰖁'
    },
    headphones: {
        normal: '󰋋',
        muted: '󰟎'
    }
}

export const soundVolume = audio.speaker.bind('volume').as(volume => volume < 0 ? 0 : volume * 100)

const getIconBinding = (icon: Icon) => audio.speaker.bind('is_muted').as(isMuted => isMuted ? icon.muted : icon.normal)

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
        children: 
        Object.assign(
            {},
            ...Object.entries(icons).map(icon => ({[icon[0]]: Widget.Label({
                    label: getIconBinding(icon[1])
                })
            }))
        ),
        shown: audio.speaker.bind('id').as(id => id === 1 ? 'default' : 'headphones'),
    })
})