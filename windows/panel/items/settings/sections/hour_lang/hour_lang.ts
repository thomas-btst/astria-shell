import Gdk from "types/@girs/gdk-3.0/gdk-3.0";
import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { ComboBoxText } from "utils/utils";
import { Item } from "windows/panel/items/items";

const timezones: string[] = Utils.exec('timedatectl list-timezones').split('\n')

// const getCurrentTimezone = () => Utils.exec('readlink /etc/localtime').

const Menu = Widget.Menu({
    children: timezones.map(timezone => Widget.MenuItem({
        label: timezone
    })),
    heightRequest: 1,
})

export const HourLangSection: Item = {
    name: 'Heure et langue',
    icon: '',
    widget: () => Widget.Button({
        onPrimaryClickRelease: (self, event) => Menu.popup_at_widget(self, Gdk.Gravity.CENTER, Gdk.Gravity.CENTER, event),
        label: 'test',
    })
}

// Widget.Window()