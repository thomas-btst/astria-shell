import { Accessor } from "ags"
import { Gtk } from "ags/gtk4"

interface SpacerProps {
    reveal: Accessor<boolean>
    spacing: number
}

export function Spacer({ reveal, spacing }: SpacerProps) {
    return (
        <revealer revealChild={reveal} transitionType={Gtk.RevealerTransitionType.SWING_LEFT} transitionDuration={400}>
            <box widthRequest={spacing} />
        </revealer>
    )
}
