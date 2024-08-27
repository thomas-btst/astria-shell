import { modulo, withDigits } from "utils/utils"
import { chrono } from "../chrono"
import Gtk from "types/@girs/gtk-3.0/gtk-3.0"
import { Locker } from "utils/locker"
import { Stack } from "types/widget"

// function Selector(val: ReturnType<typeof Variable<number>>, max: number){
//     return Widget.Box({
//         className: 'selector',
//         vertical: true,
//         spacing: 8,
//         children: [
//             Widget.Slider({
//                 orientation: Gtk.Orientation.VERTICAL,
//                 inverted: true,
//                 hpack: 'center',
//                 vpack: 'center',
//                 min: 0,
//                 max,
//                 step: 1,
//                 digits: 0,
//                 value: val.bind(),
//                 onChange: ({value}) => val.setValue(value)
//             }),
//             Widget.Label({
//                 label: val.bind().as(value => withDigits(value))
//             })
//         ]
//     })
// }

function Selector(header: string, value: ReturnType<typeof Variable<number>>, max: number){
    const stack = {
        isIncreasing: Variable(false),
        locker: new Locker(),
        lock: () => {
            const lockTime = 500
            if (!stack.locker.lockIfNotLocked(lockTime)){
                stack.locker.decreaseLock(45)
                return stack.locker.lockIfNotLocked(lockTime)
            }
            return true
        },
        increase: () => {
            if (!stack.lock())
                return
            stack.isIncreasing.setValue(true)
            value.setValue((value.value+1)%max)
        },
        decrease: () => {
            if (!stack.lock())
                return
            stack.isIncreasing.setValue(false)
            value.setValue(modulo(value.value-1, max))
        },
    }

    const Stack = (apply?: (number: number) => number) => {
        return Widget.Stack({
            className: apply ? '' : 'main',
            hpack: 'center',
            transition: stack.isIncreasing.bind().as(isIncreasing => isIncreasing ? 'slide_down' : 'slide_up'),
            transitionDuration: 400,
            children: Object.assign(
                {},
                ...[...Array(max).keys()]
                    .map(number => ({[number.toString()]: Widget.Label(withDigits(number).toString())}))
            ),
            shown: value.bind().as(number => (apply ? apply(number) : number).toString()),
        })
    }
    
    return Widget.Button({
        className: 'selector',
        vpack: 'center',
        onScrollUp: stack.increase,
        onScrollDown: stack.decrease,
        child: Widget.Box({
            vertical: true,
            spacing: 1,
            children: [
                Widget.Label({
                    className: 'header',
                    label: header
                }),
                Stack((number) => (number+1)%max),
                Stack(),
                Stack((number) => modulo(number-1, max)),
            ]
        })
    })
}

export const ClockStopped = Widget.Box({
    className: 'stopped',
    spacing: 10,
    children: [
        ...Array<[string, ReturnType<typeof Variable<number>>, number]>(
            ['Heures', chrono.settings.time.hours, 24],
            ['Minutes', chrono.settings.time.minutes, 60],
            ['Secondes', chrono.settings.time.seconds, 60],
        ).reduce((acc, params, i) => {
            if (i !== 0)
                acc.push(
                    Widget.Label({
                        className: 'separator',
                        vpack: 'center',
                        label: ':',
                    })
                )
            acc.push(Selector(...params))
            return acc
        }, Array<ReturnType<typeof Selector | typeof Widget.Label>>()),
        Widget.Button({
            className: 'stop',
            cursor: 'pointer',
            hpack: 'center',
            vpack: 'center',
            onPrimaryClick: () => chrono.timer.start(),
            label: '',
        }),
    ]
})
