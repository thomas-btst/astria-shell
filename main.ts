import { Notif } from 'windows/notif/notif'
import {Bar} from './windows/bar/bar'
import { PowerMenu } from 'windows/powermenu/powermenu'
import { Settings } from 'windows/settings/settings'

export const AGS_DIR = "~/.config/ags"

const scss = `${App.configDir}/style.scss`
const css = `/tmp/my-style.css`

try{
    const output = Utils.exec(`sassc ${scss} ${css}`)

    console.log(`Applying style...${output && '\n'}${output}`)
} catch (error){
    console.log('--- Style compilation failed ---')
    console.error(error)
}

App.config({
    style: css,
    windows: [
        Bar(),
        // Bar(1),
        PowerMenu.Bar(),
        Notif.Bar(),
        Settings.Bar(),
    ],
})
