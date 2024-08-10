import { margins, Window } from "windows/window";

const audio = await Service.import('audio')

const isMuted = audio.speaker.bind('is_muted').as(stream => {
    console.log(stream)
    return 'f'
})

const test = audio.speaker.bind('volume').as(volume => {
    console.log('volume')
    return volume
})

export const Audio = new Window('audio',
    {
        visible: false,
        anchor: ['top', 'right'],
        exclusivity: 'exclusive',
        margins: [margins],
        layer: 'top',
        monitor: 0,
        child: Widget.Box()
    }
)