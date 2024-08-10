import { limitNumberWithinRange } from "utils/utils";
import { QuickMenu } from "../quickmenu";

const date = Variable(Date.now(), {
    poll: [1000, () => Date.now()]
})
date.stopPoll()

const chrono: {
    begin: ReturnType<typeof Variable<number>>,
    time: number,
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
            hours: number,
            minutes: number,
            seconds: number,
        },
    }
} = {
    begin: Variable(0),//Variable(date.value),
    time: 0,//5 * 60 * 1000,
    pause: Variable<number | null>(null),//Variable<number | null>(date.value),
    end: (begin = chrono.begin.value): number => begin + chrono.time,
    poll: {
        isPolling: () => chrono.pause.value !== null,
        start: () => {
            if (chrono.pause.value !== null)
                date.startPoll()
        },
        stop: () => {
            if (chrono.pause.value === null)
                date.stopPoll()
        }
    },
    timer: {
        start: () => {
            chrono.time = chrono.settings.time.seconds * 1000
            chrono.begin.setValue(date.value)
            chrono.poll.start()
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
            chrono.begin.value = chrono.pause.value = date.value
        }
    },
    settings: {
        isPlaying: Variable(false),
        time: {
            hours: 0,
            minutes: 30,
            seconds: 0,
        }
    }
}

const passedtime = Utils.merge([date.bind(), chrono.begin.bind(), chrono.pause.bind()], (_date, begin, pause) => {
    const current = limitNumberWithinRange(
        (pause === null ? _date : pause) - begin,
        0,
        chrono.time
    )
    if (pause === null && current === chrono.time){
        // TITOCHECK ajouter notif fini
        chrono.timer.pause()
    }
    return current
})

export const ClockQuickMenu = new QuickMenu('clock',
    Widget.Box({
        vertical: true,
        children: [
            Widget.Stack({
                children: {
                    stopped: Widget.Box({
                        children: [
                            Widget.Slider({
                                min: 0,
                                max: 60,
                                step: 1,
                                onChange: ({value}) => {
                                    chrono.settings.time.seconds = value
                                }
                            }),
                            Widget.Button({
                                label: '',
                                onPrimaryClick: () => chrono.timer.start()
                            })
                        ]
                    }),
                    playing: Widget.Box({
                        children: [
                            Widget.Button({
                                onPrimaryClick: () => {
                                    if (chrono.pause.value === null)
                                        chrono.timer.pause()
                                    else
                                        chrono.timer.play()
                                },
                                label: chrono.pause.bind().as(pause => pause == null ? '' : ''),
                            }),
                            Widget.Button({
                                onPrimaryClick: () => chrono.timer.stop(),
                                label: '',
                            }),
                            Widget.ProgressBar({
                                value: passedtime.as(time => time / chrono.time),
                            }),
                            // Widget.CircularProgress({
                            //     startAt: 0.25,
                            //     value: passedtime.as(time => time / chrono.time.value),
                            // }),
                            Widget.Label({
                                label : passedtime.as(time => (Math.ceil((chrono.time - time) / 1000)).toString()),
                            }),
                        ]
                    }),
                },
                shown: chrono.settings.isPlaying.bind().as(isPlaying => isPlaying ? 'playing' : 'stopped'),
            }),
        ]
    })
)

// import { limitNumberWithinRange } from "utils/utils";
// import { QuickMenu } from "../quickmenu";

// const date = Variable(Date.now(), {
//     poll: [1000, () => Date.now()]
// })
// date.stopPoll()

// const chrono: {
//     begin: ReturnType<typeof Variable<number>>,
//     time: ReturnType<typeof Variable<number>>,
//     pause: ReturnType<typeof Variable<number | null>>,
//     end: (begin?: number) => number,
//     poll: {
//         start: () => void,
//         stop: () => void,
//     },
//     timer: {
//         play: () => void,
//         pause: () => void,
//         stop: () => void,
//     }
// } = {
//     begin: Variable(date.value),
//     time: Variable(5 * 60 * 1000),
//     pause: Variable<number | null>(date.value),
//     end: (begin = chrono.begin.value): number => begin + chrono.time.value,
//     poll: {
//         start: () => {
//             if (chrono.pause.value !== null)
//                 date.startPoll()
//         },
//         stop: () => {
//             if (chrono.pause.value === null)
//                 date.stopPoll()
//         }
//     },
//     timer: {
//         play: () => {
//             chrono.poll.start()
//             if (chrono.pause.value !== null)
//                 chrono.begin.value += date.value - chrono.pause.value
//             chrono.pause.value = null
//         },
//         pause: () => {
//             chrono.poll.stop()
//             chrono.pause.value = date.value
//         },
//         stop: () => {
//             chrono.poll.stop()
//             chrono.begin.value = chrono.pause.value = date.value
//         }
//     }
// }

// const passedtime = Utils.merge([date.bind(), chrono.begin.bind(), chrono.pause.bind(), chrono.time.bind()], (_date, begin, pause, time) => {
//     const current = limitNumberWithinRange(
//         (pause === null ? _date : pause) - begin,
//         0,
//         time
//     )
//     if (pause === null && current === time){
//         // TITOCHECK ajouter notif fini
//         chrono.timer.pause()
//     }
//     return current
// })

// export const ClockQuickMenu = new QuickMenu('clock',
//     Widget.Box({
//         vertical: true,
//         children: [
//             Widget.Stack({
//                 children: {

//                 },
//                 shown: chrono.,
//             }),
//             Widget.Box({
//                 children: [
//                     Widget.Slider({
//                         min: 0,
//                         max: 60,
//                         step: 1,
//                         onChange: ({value}) => {
//                             chrono.time.value = value * 1000
//                         }
//                     }),
//                     Widget.Button({
//                         label: '',
//                         onPrimaryClick: () => chrono.timer.play()
//                     })
//                 ]
//             }),
//             Widget.Box({
//                 children: [
//                     Widget.Button({
//                         onPrimaryClick: () => {
//                             if (chrono.pause.value === null)
//                                 chrono.timer.pause()
//                             else
//                                 chrono.timer.play()
//                         },
//                         label: chrono.pause.bind().as(pause => pause == null ? '' : ''),
//                     }),
//                     Widget.Button({
//                         onPrimaryClick: () => chrono.timer.stop(),
//                         label: '',
//                     }),
//                     Widget.ProgressBar({
//                         value: passedtime.as(time => time / chrono.time.value),
//                     }),
//                     // Widget.CircularProgress({
//                     //     startAt: 0.25,
//                     //     value: passedtime.as(time => time / chrono.time.value),
//                     // }),
//                     Widget.Label({
//                         label : passedtime.as(time => (Math.ceil((chrono.time.value - time) / 1000)).toString()),
//                     }),
//                 ]
//             })
//         ]
//     })
// )