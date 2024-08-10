import { Item } from "../items";
import { AccoutSection } from "./sections/account/account";
import { CustomizationSection } from "./sections/customization/customization";
import { HourLangSection } from "./sections/hour_lang/hour_lang";
import { InputSection } from "./sections/input/input";
import { ScreenSection } from "./sections/screen/screen";

const sections = [AccoutSection, HourLangSection, CustomizationSection, ScreenSection, InputSection].map((section: Item) => ({
    ...section,
    isActive: Variable(false),
}))

export const SettingsItem: Item = {
    name: 'Paramètres',
    icon: '',
    widget: () => Widget.Box({
        className: 'settings',
        vertical: true,
        spacing: 10,
        children: [
            Widget.Box({
                className: 'header',
                spacing: 6,
                homogeneous: true,
                children: sections.map(section => Widget.ToggleButton({
                    cursor: 'pointer',
                    onToggled: ({active}) => section.isActive.setValue(active),
                    active: section.isActive.bind(),
                    child: Widget.Label(section.icon),
                }))
            }),
            Widget.Button({
                className: 'arrow',
                cursor: 'pointer',
                onClicked: () => {
                    const isOpen = sections.some(section => section.isActive.value)
                    sections.forEach(section => section.isActive.setValue(!isOpen))
                },
                child: Widget.Label({
                    angle: Utils.merge(
                        [...sections.map(section => section.isActive.bind())],
                        (...actives) => actives.includes(true) ? 180 : 0,
                    ),
                    label: '',
                })
            }),
            Widget.Box({
                vertical: true,
                children: sections.map(section => Widget.Revealer({
                    revealChild: section.isActive.bind(),
                    child: Widget.Box({
                        className: 'section',
                        vertical: true,
                        spacing: 10,
                        children: [
                            Widget.Label({
                                className: 'title',
                                label: section.name,
                            }),
                            section.widget(),
                        ]
                    })
                }))
            }),
        ]
    })
}

import Gtk from "types/@girs/gtk-3.0/gtk-3.0"

export const fenetre = Widget.subclass(Gtk.Window)({
    setup(self) {
        self.visible = false
        self.name = 'test'
        self.child = Widget.Button({
            child: Widget.Label('test')
        })
        self.child.show_all()
    },
})
