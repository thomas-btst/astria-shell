import { brightness } from "services/brightness"

export const brightnessIcon = '󰖨'

export const BrightnessTray = () => Widget.Button({
    className: 'brightness',
    cursor: 'pointer',
    onPrimaryClick: () => Utils.execAsync('bash ~/.app/theme_switcher/next.sh'),
    onScrollUp: async () => brightness.screen_value+=2,
    onScrollDown: async () => brightness.screen_value-=2,
    child: Widget.Label({
        tooltipText: brightness.bind('screen_value').as(value => `${Math.trunc(value)}%`),
        yalign: 0.6,
        label: brightnessIcon,
    })
})