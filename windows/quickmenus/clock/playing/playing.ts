import { limitNumberWithinRange, PositionType, withDigits } from "utils/utils"
import { chrono, date } from "../chrono"
import { borderRadius } from "windows/window"

const passedtime = Utils.merge([date.bind(), chrono.begin.bind(), chrono.pause.bind(), chrono.time.bind()], (_date, begin, pause, time) => {
    const current = limitNumberWithinRange(
        (pause === null ? _date : pause) - begin,
        0,
        time
    )
    if (chrono.settings.isPlaying.value && pause === null && current === time){
        const times: string[] = []
        function appendTimeIfNot0(value: number, unity: string){
            if (value !== 0)
                times.push(value.toString() + unity)
        }
        appendTimeIfNot0(chrono.settings.time.hours.value, 'h')
        appendTimeIfNot0(chrono.settings.time.minutes.value, 'min')
        appendTimeIfNot0(chrono.settings.time.seconds.value, 's')
        Utils.notify({
            summary: 'Décompte terminé',
            body: times.length === 0 ? undefined : times.reduce((before, after, i) =>  before + (i === times.length - 1 ? ' et ' : ', ') + after)
        })
        chrono.timer.pause()
    }
    return current
})

const restTime = Utils.merge(
    [passedtime, chrono.time.bind()],
    (passedTime, totalTime) => totalTime === 0 ? 0 : passedTime / totalTime
)

function Progress(orientation: PositionType){
    let index: number
    switch (orientation) {
        case PositionType.LEFT: index = 0
            break
        case PositionType.TOP: index = 1
            break
        case PositionType.RIGHT: index = 2
            break
        case PositionType.BOTTOM: index = 3
    }
    const sides = orientation === PositionType.RIGHT || orientation === PositionType.LEFT
    const thickness = 4
    let css = (sides ? `min-width: ${thickness}px;` : `min-height: ${thickness}px;`)
    type Pack = 'fill' | 'start' | 'end'
    let vpack: Pack = 'fill'
    let hpack: Pack = 'fill'
    if (sides) {
        hpack = orientation === PositionType.LEFT ? 'start' : 'end'
        css += `border-top-${orientation.toLowerCase()}-radius: ${borderRadius}px; border-bottom-${orientation.toLowerCase()}-radius: ${borderRadius}px;`
    } else {
        vpack = orientation === PositionType.TOP ? 'start' : 'end'
    }
    return Widget.ProgressBar({
        css,
        vpack,
        hpack,
        vertical: sides,
        inverted: orientation === PositionType.LEFT || orientation === PositionType.BOTTOM,
        value: restTime.as(time => limitNumberWithinRange((time - index * 0.25) * 4, 0, 1))
    })
}

const Chrono = Widget.Box({
    vertical: true,
    vpack: 'center',
    spacing: 14,
    children: [
        Widget.Label({
            className: 'time',
            label : passedtime.as(time => {
                const seconds = Math.ceil((chrono.time.value - time) / 1000)
                const minutes = Math.trunc(seconds / 60)
                const hours = Math.trunc(minutes / 60)
                return [hours, minutes % 60, seconds % 60].map(time => withDigits(time)).reduce((before, after, i) => `${before}${i !== 0 ? ':' : ''}${after}`, '')
            }),
        }),
        Widget.Box({
            expand: true,
            hpack: 'center',
            children: [
                Widget.Button({
                    hpack: 'center',
                    vpack: 'center',
                    onPrimaryClick: () => chrono.timer.stop(),
                    label: '',
                }),
                Widget.Revealer({
                    transition: 'slide_right',
                    transitionDuration: 400,
                    revealChild: restTime.as(time => time !== 1),
                    child: Widget.Button({
                        hpack: 'center',
                        vpack: 'center',
                        onPrimaryClick: () => {
                            if (chrono.pause.value === null)
                                chrono.timer.pause()
                            else
                                chrono.timer.play()
                        },
                        label: chrono.pause.bind().as(pause => pause === null ? '' : ''),
                    }),
                })
            ]
        }),
    ]
})

export const ClockPlaying = Widget.Box({
    className: 'playing',
    spacing: 0,
    children: [
        Progress(PositionType.LEFT),
        Widget.Box({
            vertical: true,
            children: [
                Progress(PositionType.TOP),
                Chrono,
                Progress(PositionType.BOTTOM),
            ]
        }),
        Progress(PositionType.RIGHT)
    ],
})