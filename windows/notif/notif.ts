import { Window } from "windows/window";

const background = `${Utils.HOME}/Images/wallpaper/background`

const reveal = Variable(false)

export const Notif: Window = {
    name: 'notif',
    Bar: () => Widget.Window({
        name: Notif.name,
        visible: false,
        anchor: ['top', 'right', 'bottom'],
        className: Notif.name,
        layer: 'top',
        exclusivity: 'ignore',
        // keymode: 'exclusive',
        monitor: 0,
        child: Widget.Revealer({
            revealChild: reveal.bind(),
            transition: 'slide_left',
            child: Widget.Label('test'),
        })
    })
}
