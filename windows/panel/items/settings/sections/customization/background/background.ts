import { SideBox } from "utils/utils"

const background = `${Utils.HOME}/.cache/background`

export const BackgroundChooser = () => SideBox({
    first: Widget.Label({
        className: 'title',
        label: 'Fond d\'écran:',
    }),
    second: Widget.FileChooserButton({
        hpack: 'start',
        onFileSet: ({ uri }) => {
            Utils.exec(`cp ${uri?.replace("file://", "")} ${background}`)
            Utils.exec(`swww img ${background}`)
        },
    }),
})