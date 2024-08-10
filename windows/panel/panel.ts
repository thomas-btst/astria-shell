import { margins, Window } from "windows/window";

import { SettingsItem } from "./items/settings/settings";
import { HomeItem } from "./items/home/home";
import { NotificationsItem } from "./items/notifications/notifications";
import { HelpItem } from "./items/help/help";
import { Item } from "./items/items";

const items: Array<Item> = [HomeItem, NotificationsItem, SettingsItem, HelpItem]

const state = Variable(items[0].name)

export const Panel: Window = new Window('panel',
    {
        visible: false,
        anchor: ['top', 'right', 'bottom'],
        margins: [margins, margins, margins, 0],
        layer: 'top',
        exclusivity: 'exclusive',
        monitor: 0,
        child: Widget.Box({
            className: 'container',
            children: [
                Widget.Stack({
                    transition: 'slide_up_down',
                    transitionDuration: 350,
                    shown: state.bind(),
                    children: Object.assign(
                        {},
                        ...items.map(item => ({
                            [item.name]: Widget.Scrollable({
                                hscroll: 'never',
                                vscroll: 'external',
                                child: Widget.Box({
                                    className: 'item',
                                    vertical: true,
                                    children: [
                                        Widget.Label({
                                            className: 'title',
                                            label: state.bind(),
                                        }),
                                        item.widget()
                                    ]
                                })
                            })
                        }))
                    ),
                }),
                Widget.Box({
                    className: 'menu',
                    vertical: true,
                    children: items.map(item => Widget.Button({
                        className: state.bind().as(current => current == item.name ? 'active':''),
                        cursor: 'pointer',
                        onClicked: () => state.setValue(item.name),
                        child: Widget.Label(item.icon),
                    })),
                }),
            ]
        }),
    },
    {
        onWindowToggle: () => state.setValue(NotificationsItem.name),
        transition: {
            type: 'slide_left',
            duration: 350,
        }
    },
)
