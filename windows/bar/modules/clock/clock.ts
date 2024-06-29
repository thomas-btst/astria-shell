import { Locker } from "utils/locker"
import { limitNumberWithinRange, withDigits } from "utils/utils"

const date = Variable(new Date, {
    poll: [1000, () => new Date]
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

    static locker = new Locker(animationDuration - 150)

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
                if (!this.locker.lock())
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
                    label: date.bind().as(date => `${withDigits(date.getDate())}/${withDigits(date.getMonth() + 1)}/${date.getFullYear()} `)
                }),
            }),

            // Time
            Widget.Label({
                label: date.bind().as(date => `${withDigits(date.getHours())}:${withDigits(date.getMinutes())}`)
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
                    label: date.bind().as(date => `:${withDigits(date.getSeconds())}`),
                }),
            }),
        ]
    })
})