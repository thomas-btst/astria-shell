import { compileCss, cssFile } from "main"

export const ThemeChooser = () => Widget.Button({
    onClicked: () => {
        console.log('Début')
        compileCss()
        App.applyCss(cssFile)
        console.log('Fin')
    },
    label: 'Actualiser le thème',
})