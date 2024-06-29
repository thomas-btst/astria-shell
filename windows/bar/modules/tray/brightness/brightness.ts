import { brightness } from "services/brightness"

export const BrightnessTray = () => Widget.Button({
    className: 'brightness',
    cursor: 'pointer',
    onPrimaryClick: () => Utils.execAsync('bash ~/.app/theme_switcher/next.sh'),
    onScrollUp: () => brightness.addValue(2),
    onScrollDown: () => brightness.addValue(-2),
    child: Widget.Label({
        tooltipText: brightness.bind('screen_value').as(value => `${Math.trunc(value)}%`),
        yalign: 0.6,
        label: '󰖨',
    })
})