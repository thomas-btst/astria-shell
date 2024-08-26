import Gtk from "types/@girs/gtk-3.0/gtk-3.0"
import { Binding } from "types/service"
import { margins, MultiWindow } from "windows/window"
import { Locker } from "utils/locker"

export class Level extends MultiWindow {

    private displayTime = 0

    private locker = new Locker

    private isHovered = false

    private onHover() {
        this.isHovered = true
    }

    private onHoverLost() {
        this.isHovered = false
        this.show(1000)
    }

    constructor(params: {
        name: string,
        icon: Binding<any, any, string> | string,
        value: Binding<any, any, number>,
        set: (value: number) => void,
        onClicked?: (() => void) | undefined,
    }) {
        const clickable = params.onClicked != undefined

        if(typeof params.icon !== 'string')
            params.icon = params.icon.as(icon => {
                this.show()
                return icon
            })

        super('level',
            params.name,
            {
                visible: false,
                className: `level`,
                anchor: ['right'],
                layer: 'overlay',
                monitor: 0,
                child: Widget.Box({
                    css: `margin-right: ${margins}px;`,
                    className: params.name,
                    vertical: true,
                    spacing: 6,
                    children: [
                        Widget.EventBox({
                            onHover: () => this.onHover(),
                            onHoverLost: () => this.onHoverLost(),
                            child: Widget.Slider({
                                cursor: 'pointer',
                                onChange: ({value}) => params.set(value),
                                orientation: Gtk.Orientation.VERTICAL,
                                value: params.value.as(value => {this.show(); return value}),
                                min: 0,
                                max: 1,
                                step: 0.01,
                                drawValue: false,
                                inverted: true,
                            }),
                        }),
                        Widget.Button({
                            className: clickable ? 'clickable' : '',
                            cursor: clickable ? 'pointer' : 'default',
                            hpack: 'center',
                            onClicked: () => {
                                if(params.onClicked == undefined)
                                    return
                                this.show()
                                params.onClicked()
                            },
                            onHover: () => this.onHover(),
                            onHoverLost: () => this.onHoverLost(),
                            label: params.icon,
                        })
                    ].map((button) => button.on('leave-notify-event', (self, event) => {
                        self.on_hover_lost(self, event)
                    }))
                })
            },
            {
                transition: {
                    type: 'slide_left',
                    duration: 300,
                }
            }
        )
        this.locker.lock(1000)
    }

    show(ms: number = 3000){
        if (this.locker.isLocked || this.isHovered)
            return
        this.displayTime = Date.now() + ms
        this.closeOthers()
        this.open()
        Utils.timeout(ms, () => {
            if(!this.isHovered && this.displayTime <= Date.now())
                this.close()
        })
    }
}
