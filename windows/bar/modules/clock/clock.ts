import Gdk from "types/@girs/gdk-3.0/gdk-3.0"
import GLib from "types/@girs/glib-2.0/glib-2.0"
import { Locker } from "utils/locker"
import { limitNumberWithinRange, withDigits } from "utils/utils"
import { ClockQuickMenu } from "windows/quickmenus/clock/clock"

const date = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()]
})

const animationDuration = 440

enum StatusEnum{ // TITOCHECK StateEnum
    ALL,
    SEDONDS,
    NONE,
    DATE,
}

enum EventEnum{
    SCROLL_UP,
    SCROLL_DOWN,
    CLICKED,
}

abstract class ClockState{
    static state = Variable(StatusEnum.NONE)

    private static statusEnumLength = Object.keys(StatusEnum).length / 2

    static locker = new Locker()

    static dispatchEvent(event: EventEnum){
        switch(event) {
            case EventEnum.CLICKED: {
                switch(this.state.value) {
                    case StatusEnum.NONE: {
                        this.state.value = StatusEnum.ALL
                        break
                    }
                    default: {
                        this.state.value = StatusEnum.NONE
                        break
                    }
                }
                break
            }
            case EventEnum.SCROLL_UP:
            case EventEnum.SCROLL_DOWN: {
                if (!this.locker.lockIfNotLocked(animationDuration - 150))
                    return
                const currentValue = this.state.value == StatusEnum.ALL ? StatusEnum.NONE : this.state.value
                const updatedRevealValue = limitNumberWithinRange(
                    currentValue + (event == EventEnum.SCROLL_UP ? 1 : -1),
                    1,
                    this.statusEnumLength - 1,
                )
                this.state.value = StatusEnum[StatusEnum[updatedRevealValue]]
                break
            }
        }
    }
    
    static show
}

export const ClockModule = () => Widget.Button({
    className: 'clock',
    cursor: 'pointer',

    onPrimaryClick: () => ClockState.dispatchEvent(EventEnum.CLICKED),
    onSecondaryClickRelease: () => ClockQuickMenu.toggle(),
    onScrollUp: () => ClockState.dispatchEvent(EventEnum.SCROLL_UP),
    onScrollDown: () => ClockState.dispatchEvent(EventEnum.SCROLL_DOWN),

    child: Widget.Box({
        children: [
            // Date
            Widget.Revealer({
                revealChild: ClockState.state.bind().as(reveal =>
                    reveal == StatusEnum.ALL ||
                        reveal == StatusEnum.DATE
                ),

                transition: 'slide_right',
                transitionDuration: animationDuration,

                child: Widget.Label({
                    label: date.bind().as(date => `${withDigits(date.get_day_of_month())}/${withDigits(date.get_month())}/${date.get_year()} `)
                }),
            }),

            // Time
            Widget.Label({
                label: date.bind().as(date => `${withDigits(date.get_hour())}:${withDigits(date.get_minute())}`)
            }),

            // Seconds
            Widget.Revealer({
                revealChild: ClockState.state.bind().as(reveal => 
                    reveal == StatusEnum.ALL ||
                        reveal == StatusEnum.SEDONDS
                ),

                transition: 'slide_left',
                transitionDuration: animationDuration,

                child: Widget.Label({
                    label: date.bind().as(date => `:${withDigits(date.get_second())}`),
                }),
            }),
        ]
    })
})