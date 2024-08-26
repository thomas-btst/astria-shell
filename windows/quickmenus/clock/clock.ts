import { limitNumberWithinRange, withDigits } from "utils/utils";
import { QuickMenu } from "../quickmenu";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";

const date = Variable(Date.now(), {
    poll: [1000, () => Date.now()]
})
date.stopPoll()

const chrono: {
    begin: ReturnType<typeof Variable<number>>,
    time: ReturnType<typeof Variable<number>>,
    pause: ReturnType<typeof Variable<number | null>>,
    end: (begin?: number) => number,
    poll: {
        isPolling: () => boolean,
        start: () => void,
        stop: () => void,
    },
    timer: {
        start: () => void,
        play: () => void,
        pause: () => void,
        stop: () => void,
    },
    settings: {
        isPlaying: ReturnType<typeof Variable<boolean>>,
        time: {
            hours: ReturnType<typeof Variable<number>>,
            minutes: ReturnType<typeof Variable<number>>,
            seconds: ReturnType<typeof Variable<number>>,
        },
    }
} = {
    begin: Variable(0),
    time: Variable(0),
    pause: Variable<number | null>(null),
    end: (begin = chrono.begin.value): number => begin + chrono.time.value,
    poll: {
        isPolling: () => chrono.pause.value !== null,
        start: () => {
            if (chrono.pause.value !== null || !chrono.settings.isPlaying.value)
                date.startPoll()
        },
        stop: () => {
            if (chrono.pause.value === null && chrono.settings.isPlaying.value)
                date.stopPoll()
        }
    },
    timer: {
        start: () => {
            chrono.poll.start()
            chrono.time.value = ((chrono.settings.time.hours.value * 60 + chrono.settings.time.minutes.value) * 60 + chrono.settings.time.seconds.value) * 1000
            chrono.begin.setValue(date.value)
            chrono.settings.isPlaying.setValue(true)
            chrono.pause.setValue(null)
        },
        play: () => {
            chrono.poll.start()
            if (chrono.pause.value !== null)
                chrono.begin.value += date.value - chrono.pause.value
            chrono.pause.value = null
        },
        pause: () => {
            chrono.poll.stop()
            chrono.pause.value = date.value
        },
        stop: () => {
            chrono.poll.stop()
            chrono.settings.isPlaying.setValue(false)
        }
    },
    settings: {
        isPlaying: Variable(false),
        time: {
            hours: Variable(0),
            minutes: Variable(20),
            seconds: Variable(0),
        }
    }
}

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

function Selector(val: ReturnType<typeof Variable<number>>, max: number){
    return Widget.Box({
        className: 'selector',
        vertical: true,
        spacing: 8,
        children: [
            Widget.Slider({
                orientation: Gtk.Orientation.VERTICAL,
                inverted: true,
                hpack: 'center',
                vpack: 'center',
                min: 0,
                max,
                step: 1,
                digits: 0,
                value: val.bind(),
                onChange: ({value}) => val.setValue(value)
            }),
            Widget.Label({
                label: val.bind().as(value => withDigits(value))
            })
        ]
    })
}



export const ClockQuickMenu = new QuickMenu('clock',
    Widget.Box({
        className: 'clock',
        vertical: true,
        children: [
            Widget.Stack({
                children: {
                    stopped: Widget.Box({
                        className: 'stopped',
                        spacing: 10,
                        children: [
                            ...Array<[ReturnType<typeof Variable<number>>, number]>(
                                [chrono.settings.time.hours, 23],
                                [chrono.settings.time.minutes, 59],
                                [chrono.settings.time.seconds, 59],
                            ).reduce((acc, params, i) => {
                                if (i !== 0)
                                    acc.push(
                                        Widget.Label({
                                            vpack: 'end',
                                            label: ':',
                                        })
                                    )
                                acc.push(Selector(...params))
                                return acc
                            }, Array<ReturnType<typeof Selector | typeof Widget.Label>>()),
                            Widget.Button({
                                cursor: 'pointer',
                                hpack: 'center',
                                vpack: 'center',
                                onPrimaryClick: () => chrono.timer.start(),
                                label: '',
                            })
                        ]
                    }),
                    playing: Widget.Box({
                        className: 'playing',
                        vertical: true,
                        vpack: 'center',
                        spacing: 14,
                        children: [
                            // Widget.ProgressBar({
                            //     value: passedtime.as(time => time / chrono.time),
                            // }),
                            // Widget.CircularProgress({
                            //     startAt: 0.25,
                            //     value: passedtime.as(time => time / chrono.time.value),
                            // }),
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
                                hpack: 'center',
                                spacing: 10,
                                children: [
                                    Widget.Button({
                                        hpack: 'center',
                                        vpack: 'center',
                                        onPrimaryClick: () => chrono.timer.stop(),
                                        label: '',
                                    }),
                                    Widget.Button({
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
                                ]
                            }),
                        ]
                    }),
                },
                shown: chrono.settings.isPlaying.bind().as(isPlaying => isPlaying ? 'playing' : 'stopped'),
                transition: 'over_down_up',
                transitionDuration: 400,
            }),
        ]
    })
)