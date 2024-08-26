import { Panel } from 'windows/panel/panel'
import {Bar} from './windows/bar/bar'
import { PowerMenu } from 'windows/powermenu/powermenu'
import { Notifications } from 'windows/notifications/notifications'
import { Audio } from 'windows/audio/audio'
import { Levels } from 'windows/levels/levels'
import { StartDaemons } from 'daemons/daemons'
import { QuickMenus } from 'windows/quickmenus/quickmenus'

const scssFile = `${App.configDir}/style.scss`
export const cssFile = `/tmp/ags/style.css`

export const compileCss = () => {
    try{
        const output = Utils.exec(`sassc ${scssFile} ${cssFile}`)

        console.log(`Applying style...${output && '\n'}${output}`)
    } catch (error){
        console.log('--- Style compilation failed ---')
        console.error(error)
    }
}

compileCss()

App.config({
    style: cssFile,
    windows: [
        Bar(),
        // Bar(1),
        Notifications.Bar(),
        PowerMenu.Bar(),
        Panel.Bar(),
        Audio.Bar(),
        ...QuickMenus.map((quickmenu) => quickmenu.Bar()),
        ...Levels.map((level) => level.Bar()),
    ],
})

Utils.monitorFile(App.configDir, (file) => {
    if (!file.get_basename()?.endsWith('.scss'))
        return
    compileCss()
    App.resetCss()
    App.applyCss(cssFile)
})

StartDaemons()