import Gtk from "types/@girs/gtk-3.0/gtk-3.0"
import { Binding } from "types/service"
import { margins, MultiWindow } from "windows/window"
import { Locker } from "utils/locker"

const displayTime = 3000

export class Level extends MultiWindow {

    private displayTime = 0

    private locker = new Locker

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
                        Widget.Slider({
                            cursor: 'pointer',
                            onChange: ({value}) => params.set(value / 100),
                            orientation: Gtk.Orientation.VERTICAL,
                            value: params.value.as(value => {this.show(); return value * 100}),
                            min: 0,
                            max: 100,
                            step: 1,
                            drawValue: false,
                            inverted: true,
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
                            label: params.icon,
                        }),
                    ]
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

    show(){
        if (this.locker.isLocked)
            return
        this.displayTime = Date.now() + displayTime
        this.closeOthers()
        this.open()
        Utils.timeout(displayTime, () => {
            if(this.displayTime <= Date.now())
                this.close()
        })
    }
}
