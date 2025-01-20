import { Stream } from "types/service/audio";
import { QuickMenu } from "../quickmenu";

const audio = await Service.import('audio')

function Slider(stream: Stream){
    return Widget.Slider({
        onChange: ({value}) => stream.volume = value,
        min: 0,
        max: 1,
        value: stream.bind('volume'),
    })
}

export const SpeakerQuickMenu = new QuickMenu('speaker',
    Widget.Box({
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box({
                    children: [
                        Slider(audio.speaker)
                    ]
                })
            ]
            // Utils.merge([audio.bind('speaker'), audio.bind('speakers')], (speaker: Stream, speakers: Stream[]) => {
            //     return [Widget.Box({

            //     })].concat(
            //         speakers.filter(s => s.id !== speaker.id).map(s => Widget.Label())
            //     )//Widget.Label(s.description ?? 'Périférique inconnu')
            // })
        })
    })
)