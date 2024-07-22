import { Settings } from "windows/settings/settings";
import { margins, Window } from "windows/window";

export const Panel: Window = {
    name: 'panel',
    Bar: () => Widget.Window({
        name: Panel.name,
        visible: false,
        anchor: ['top', 'right', 'bottom'],
        margins: [margins, margins, margins, 0],
        className: Panel.name,
        layer: 'top',
        exclusivity: 'exclusive',
        monitor: 0,
        child: Widget.Box({
            vertical: true,
            children: [
                Widget.Box({
                    homogeneous: true,
                    children: [
                        Widget.Button({
                            hpack: 'start',
                            onClicked: () => {
                                App.closeWindow(Settings.name)
                                App.closeWindow(Panel.name)
                            },
                            child: Widget.Label('')
                        }),
                        Widget.Button({
                            hpack: 'end',
                            onClicked: () => {
                                App.toggleWindow(Settings.name)
                            },
                            child: Widget.Label('')
                        }),
                    ]
                }),
                Widget.Label('tefkjfk kjdkljdfmq jmd kj kqljfdlkm qfmfdjsmklqj fjkst'),
            ]
        }),
    }),
}
