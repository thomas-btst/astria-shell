import { Variable } from "resource:///com/github/Aylur/ags/variable.js"
import { Event } from "types/@girs/gdk-3.0/gdk-3.0.cjs"
import { modulo } from "utils/utils"
import { Window } from "windows/window"

interface ButtonData {
    icon: string,
    cmd: string,
    className: string,
    isSelected: Variable<boolean>,
}

interface PowerState {
    current: number | null,
    buttons: ButtonData[],
}

const powerState: PowerState = {
    current: null,
    buttons: Array<[string, string, string]>(
        ['', 'systemctl poweroff', 'poweroff'],
        ['', 'systemctl reboot', 'reboot'],
        ['󰗽', 'killall Hyprland', 'logout'],
        ['', 'swaylock', 'lock'],
        ['󰒲', 'swaylock ; systemctl suspend', 'suspend'],
    ).map((button) => ({
        icon: button[0],
        cmd: button[1],
        className: button[2],
        isSelected: new Variable(false),
    }))
}

const PowerButton = (index: number) => {
    const button = powerState.buttons[index]
    return Widget.Button({
        classNames: button.isSelected.bind().as(isSelected => [button.className].concat(isSelected ? ['selected'] : [])),
        cursor: 'pointer',
        onPrimaryClick: () => {
            App.closeWindow(PowerMenu.name)
            Utils.execAsync(`bash -c '${button.cmd}'`)
        },
        onHover: () => updateButtons(index),
        child: Widget.Label(button.icon),
    })
}

function updateButtons(current: number | null){
    powerState.current = current
    powerState.buttons.forEach((button, index) => {
        if(index == current)
            button.isSelected.value = true
        else if(button.isSelected.value == true) button.isSelected.value = false
    })
}

enum KeyEnum {
    LEFT = 113,
    TOP = 111,
    RIGHT = 114,
    BOTTOM = 116,
    H = 43,
    K = 45,
    L = 46,
    J = 44,
    RETURN = 36,
    ESCAPE = 9,
}

export const PowerMenu: Window = {
    name: 'powermenu',

    Bar: () => {

        function dispatchKeyPress(event: Event){
            var current: number | null = powerState.current
            switch(event.get_keycode()[1]) {
                case KeyEnum.TOP:
                case KeyEnum.K:
                case KeyEnum.LEFT:
                case KeyEnum.H: {
                    if (current == null)
                        current = 0
                    else
                        current--
                    break
                }
                case KeyEnum.BOTTOM:
                case KeyEnum.J: if (current == null){
                    current = Math.trunc(powerState.buttons.length / 2)
                    break
                }
                case KeyEnum.RIGHT:
                case KeyEnum.L: {
                    if (current == null)
                        current = powerState.buttons.length-1
                    else
                        current++
                    break
                }
                case KeyEnum.RETURN: {
                    App.closeWindow(PowerMenu.name)
                    Utils.execAsync(`bash -c '${powerState.buttons[current ?? 0].cmd}'`)
                    return
                }
                case KeyEnum.ESCAPE: {
                    App.closeWindow(PowerMenu.name)
                    return
                }
                default: return
            }
            current = Math.abs(modulo(current, powerState.buttons.length))
            updateButtons(current)
        }

        return Widget.Window({
            name: PowerMenu.name,
            visible: false,
            anchor: ['left', 'top', 'right', 'bottom'],
            className: PowerMenu.name,
            layer: 'top',
            exclusivity: 'ignore',
            keymode: 'exclusive',
            monitor: 0,
            child: Widget.EventBox({
                cursor: 'default',
                onPrimaryClick: () => App.toggleWindow(PowerMenu.name),
                child: Widget.EventBox({
                    onHoverLost: () => updateButtons(null),
                    hpack: 'center',
                    vpack: 'center',
                    child: Widget.Box({
                        hpack: 'center',
                        vpack: 'center',
                        children: powerState.buttons.map((button, index: number) => PowerButton(index)),
                    })
                })
            })
        }).on('key-press-event', (self, event: Event) => dispatchKeyPress(event))
        .hook(App, (self, windowName, visible) => {
            updateButtons(null)
        }, 'window-toggled')
    }
}