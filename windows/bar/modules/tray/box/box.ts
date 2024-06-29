import { event_get, RGBA } from "types/@girs/gdk-3.0/gdk-3.0.cjs"
import { Style } from "types/@girs/gtk-3.0/gtk-3.0.cjs"
import { TrayItem } from "types/service/systemtray"

const systemtray = await Service.import('systemtray')

const boxReveal = Variable(false)

const SysTrayItem = (item: TrayItem) => {
    if (item.menu){
        // console.log(item.menu.margin=100)
        // item.menu
    }
    return Widget.Button({
        cursor: 'pointer',
        child: Widget.Icon().bind('icon', item, 'icon'),
        tooltipMarkup: item.bind('tooltip_markup'),
        vpack: 'center',
        onPrimaryClick: (_, event) => item.openMenu(event),
        onSecondaryClick: (_, event) => item.openMenu(event),
    })
}

export const BoxTray = () => Widget.Box({
    className: 'box',
    spacing: 0,
    children: [
        Widget.Revealer({
            revealChild: boxReveal.bind(),
            transition: 'slide_left',
            transitionDuration: 400,
            child: Widget.Box({
                spacing: 1,
                className: 'systemtray',
                children: systemtray.bind('items').as(i => i.map(SysTrayItem)),
            }),
        }),
        Widget.ToggleButton({
            className: 'arrow',
            cursor: 'pointer',
            onToggled: ({active}) => boxReveal.setValue(active),
            child: Widget.Label({
                angle: boxReveal.bind().as(reveal => reveal ? 270 : 0),
                label: '',
            })
        }),
    ]
})