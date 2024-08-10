import { capitalize } from "utils/utils"

const hyprland = await Service.import('hyprland')

const windowReveal = Variable(false)

const windowTitle = hyprland.active.client.bind('class').as(title => title.toLowerCase() || 'desktop')

const windowIconReplacers = new Map<string, string>([
    ['alacritty', 'Alacritty'],
    // ["spotify", "spotify-client"],
])

const windowTitleReplacers = new Map<string, string>([
    ['wofi', 'rechercher'],
])

const windowIcon = windowTitle.as (title =>
    title.replace(' ', '-')
).as(title => {
    const iconName = windowIconReplacers.get(title) ?? title
    if (Utils.lookUpIcon(iconName) == null)
        return 'action-unavailable-symbolic'
    return iconName
})

export const WindowModule = () => Widget.Button({
    className: 'windowInfo',
    cursor: 'pointer',

    onHover: () => {windowReveal.value = true},
    onHoverLost: () => {windowReveal.value = false},

    onPrimaryClick: () => Utils.execAsync(['wofi', '--fork'], ),
    onSecondaryClick: () => Utils.execAsync(['hyprshade', 'toggle']),

    child: Widget.Box({
        children: [
            Widget.Revealer({
                revealChild: windowReveal.bind(),
                transitionDuration: 400,
                transition: 'slide_left',
                child: Widget.Icon({
                    icon: windowIcon,
                    size: 16
                })
            }),
            Widget.Label({
                className: 'title',
                label: windowTitle.as(title => capitalize(windowTitleReplacers.get(title) ?? title)),
            }),
        ]
    })
}).on('leave-notify-event', (self, event) => {
    windowReveal.value = false
})
