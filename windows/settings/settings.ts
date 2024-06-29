import { Window } from "windows/window";

export const Settings: Window = {
    name: 'settings',
    Bar: () => Widget.Window({
        name: Settings.name,
        visible: false,
        className: Settings.name,
        layer: 'overlay',
        monitor: 0,
        child: Widget.Label('teksjfkjdskfjdlfsjdk'),
    })
}

// Widget.FileChooserButton({
//     onFileSet: ({ uri }) => {
//         Utils.exec(`cp ${uri?.replace("file://", "")} ${background}`)
        
//         Utils.exec(`hyprctl hyprpaper unload "${background}"`)
//         Utils.exec(`hyprctl hyprpaper preload "${background}"`)
//         Utils.exec(`hyprctl hyprpaper wallpaper ",${background}"`)
//     },
// })