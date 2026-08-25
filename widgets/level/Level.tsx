import { timeout } from "ags/time"
import { MultiWindowOverlay } from "../WindowOverlay"
import { Locker } from "../../utils/locker"
import { Accessor } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import { Env } from "../../utils/env"
import { Cursor } from "../../utils/gtk"
import { Utils } from "../../utils/utils"
import { Spacer } from "../Spacer"

interface MultiWindowOverlayProps {
    name: string
    icon: Accessor<string> | string
    value: Accessor<number>
    setValue: (value: number) => void
    active?: Accessor<boolean>
}

const iconSize = Env.iconSize + 2
const spacerSize = iconSize + 16

export class Level extends MultiWindowOverlay {
    private displayTime = 0

    private locker = new Locker()

    private isHovered = false

    readonly name: string

    private onHover() {
        this.isHovered = true
    }

    private onHoverLost() {
        this.isHovered = false
        if (this.reveal()) this.show(750)
    }

    constructor({ name, icon, value, setValue, active }: MultiWindowOverlayProps) {
        const val = value((value) => Utils.Number.round(value, 2))
        super("level", {
            name: `level-${name}`,
            class: `level`,
            namespace: "astria-level",
            anchor: Astal.WindowAnchor.BOTTOM,
            layer: Astal.Layer.OVERLAY,
            revealer: {
                valign: Gtk.Align.END,
                transitionType: Gtk.RevealerTransitionType.SLIDE_UP,
                transitionDuration: 300,
            },
            children: () => (
                <overlay class={name} marginBottom={Env.margin * 2}>
                    <slider
                        sensitive={true}
                        cursor={Cursor.POINTER}
                        orientation={Gtk.Orientation.HORIZONTAL}
                        value={val}
                        onChangeValue={({ value }) => {
                            setValue(value)
                        }}
                        min={0}
                        max={1}
                        drawValue={false}
                        inverted={false}
                    />
                    <box $type="overlay" sensitive={false} halign={Gtk.Align.CENTER}>
                        <Spacer reveal={val((val) => val > 0.425 && val < 0.5)} spacing={spacerSize} />
                        <image
                            cssClasses={val((val) => Utils.classNames(val < 0.5 && "low"))}
                            iconName={icon}
                            pixelSize={iconSize}
                        />
                        <Spacer reveal={val((val) => val < 0.575 && val >= 0.5)} spacing={spacerSize} />
                    </box>
                    <Gtk.EventControllerMotion
                        onEnter={() => {
                            this.onHover()
                        }}
                        onLeave={() => {
                            this.onHoverLost()
                        }}
                    />
                </overlay>
            ),
        })

        this.name = name

        val.subscribe(() => {
            this.show()
        })
        active?.subscribe(() => {
            this.show()
        })

        this.locker.lock(1000)
    }

    show(ms: number = 3000) {
        if (this.locker.isLocked || this.isHovered) return
        this.displayTime = Date.now() + ms
        this.open()
        timeout(ms, () => {
            if (!this.isHovered && this.displayTime <= Date.now()) this.close()
        })
    }
} //TODO set gnome style
