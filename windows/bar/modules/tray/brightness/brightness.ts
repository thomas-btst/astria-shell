import { brightness } from "services/brightness"
import { BrightnessLevel } from "windows/levels/brightness/brightness"
import { brightnessIcon } from "./data"

export const BrightnessTray = () => Widget.Button({
    className: 'brightness',
    cursor: 'pointer',
    onPrimaryClick: () => Utils.execAsync('bash ~/.app/theme_switcher/next.sh'),
    onScrollUp: async () => brightness.screen_value+=0.02,
    onScrollDown: async () => brightness.screen_value-=0.02,
    onHover: () => BrightnessLevel.show(),
    child: Widget.Label({
        tooltipText: brightness.bind('screen_value').as(value => `${Math.trunc(value * 100)}%`),
        yalign: 0.6,
        label: brightnessIcon,
    })
})