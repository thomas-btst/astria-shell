import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { Item } from "../items";
import Gdk from "types/@girs/gdk-3.0/gdk-3.0";

const powerprofiles = await Service.import('powerprofiles')

const Menu: Gtk.Menu = Widget.Menu({
    children: powerprofiles.bind('profiles')
        .as(profiles => profiles.map(profile => Widget.MenuItem({
            on_activate: () => powerprofiles.active_profile = profile.Profile,
            label: profile.Profile,
        })))
})

export const HomeItem: Item = {
    name: 'Accueil',
    icon: '',
    widget: () => Widget.Box({
        homogeneous: true,
        children: [
            Widget.Button({
                className: 'powerprofile',
                cursor: 'pointer',
                hpack: 'start',
                onPrimaryClickRelease: (self, event) => Menu.popup_at_widget(self, Gdk.Gravity.CENTER, Gdk.Gravity.CENTER, event),
                yalign: 0.8,
                label: powerprofiles.bind('active_profile')
            }),
            Widget.Slider({
                cursor: 'col-resize',
                onChange: ({value}) => powerprofiles.active_profile = powerprofiles.profiles[value].Profile,
                digits: 0,
                min: 0,
                max: powerprofiles.bind('profiles').as(profiles => profiles.length - 1),
                marks: powerprofiles.bind('profiles').as(profiles => profiles.map((profile, i) => i)),
                value: Utils.merge(
                    [
                        powerprofiles.bind('active_profile'),
                        powerprofiles.bind('profiles')
                    ], (activeProfile, profiles) => profiles.findIndex(profile => profile.Profile === activeProfile)
                ),
                // setup(self) {
                //     self.adjustment.value = powerprofiles.profiles.findIndex(profile => profile.Profile === powerprofiles.active_profile)
                // },
            }),
        ]
    })
}