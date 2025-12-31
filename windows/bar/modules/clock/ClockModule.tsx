import { Gtk } from "ags/gtk4"
import { Accessor, createState, With } from "ags"
import { Cursor } from "../../../../utils/gtk"
import { Clock } from "../../../../services/clock_service"

enum StateEnum {
    ALL,
    SEDONDS,
    NONE,
    DATE,
}

interface ClockRevealerProps {
    value: Accessor<string>
    clockType: StateEnum
    currentState: Accessor<StateEnum>
    transitionType: Gtk.RevealerTransitionType
}

function ClockRevealer({ value, clockType, currentState, transitionType }: ClockRevealerProps) {
    const reveal = currentState((currentState) => currentState === clockType || currentState === StateEnum.ALL)
    return (
        <revealer revealChild={reveal} transitionType={transitionType} transitionDuration={440}>
            <label label={value} />
        </revealer>
    )
}

function Time() {
    const clock = Clock.get_default()

    return (
        <box>
            <With value={clock.parsedTimeHHMM}>{(time) => <label label={time} />}</With>
        </box>
    )
}

export function ClockModule() {
    const clock = Clock.get_default()

    const [state] = createState(StateEnum.NONE) //TODO add settings

    return (
        <menubutton class="clock" halign={Gtk.Align.CENTER} cursor={Cursor.POINTER}>
            <box>
                <ClockRevealer
                    value={clock.parsedDateDDMMYYYY((date) => `${date} `)}
                    clockType={StateEnum.DATE}
                    currentState={state}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                />
                <Time />
                <ClockRevealer
                    value={clock.parsedSeconds((seconds) => `:${seconds}`)}
                    clockType={StateEnum.SEDONDS}
                    currentState={state}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                />
            </box>
            <popover>
                {" "}
                //TODO add css
                <Gtk.Calendar />
            </popover>
        </menubutton>
    )
}
