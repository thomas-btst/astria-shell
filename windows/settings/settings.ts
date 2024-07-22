import { Window } from "windows/window";

const background = `${Utils.HOME}/Images/wallpaper/background`

const backgroundChooser = () => Widget.FileChooserButton({
    onFileSet: ({ uri }) => {
        Utils.exec(`cp ${uri?.replace("file://", "")} ${background}`)
        Utils.exec(`swww img ${background}`)
    },
})

const header = () => Widget.CenterBox({
    homogeneous: true,
    startWidget: Widget.Label({
        hpack: 'start',
        label: '',
    }),
    centerWidget: Widget.Label('Paramètres'),
    endWidget: Widget.Button({
        hpack: 'end',
        onClicked: () => App.closeWindow(Settings.name),
        child: Widget.Label('')
    })
})

export const Settings: Window = {
    name: 'settings',
    Bar: () => Widget.Window({
        name: Settings.name,
        visible: false,
        className: Settings.name,
        layer: 'top',
        monitor: 0,
        child: Widget.Box({
            vertical: true,
            children: [
                header(),
                Widget.Label('Background:'),
                backgroundChooser(),
            ]
        }),
    })
}