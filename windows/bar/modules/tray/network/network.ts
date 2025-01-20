import { limitNumberWithinRange } from "utils/utils"

const network = await Service.import('network')

const icons = {
    disconnected: '󰤮',
    connected: ['󰤟', '󰤢', '󰤥', '󰤨'],
    alert: ['󰤠', '󰤣', '󰤦', '󰤩']
}

interface Network {
    name: string,
    icon: string,
}

const networkData = Variable({
    name: '',
    icon: icons.disconnected,
})

Utils.interval(1000, () => {
    const iteration = (array: any[], level: number) => array[limitNumberWithinRange(
        Math.trunc(array.length * level / 100),
        0,
        array.length - 1,
    )]

    const net = network
    let icon = icons.disconnected
    if(net.wifi.internet !== 'disconnected') icon = iteration(
        (net.connectivity === 'full' ? icons.connected : icons.alert),
        net.wifi.strength,
    )

    if(!net.wifi.enabled)
        icon = '󰪎'

    let name: string

    if(net.wifi.enabled)
        name = net.connectivity === 'none' ? 'Déconnecté' : (net.wifi.ssid ?? '')
    else
        name = 'Désactivé'
        
    networkData.setValue({
        name,
        icon,
    })
})

const isReloading = Variable(false)

export const NetworkTray = () => Widget.Box({
    className: 'network',
    children: [
        Widget.Revealer({
            className: 'ethernet',
            revealChild: network.bind('primary').as(primary => primary === 'wired'),
            transition: 'slide_right',
            transitionDuration: 440,
            child: Widget.Label({
                tooltipText: 'Ethernet',
                yalign: 0.6,
                label: '󰡪',
            })
        }),
        Widget.Button({
            className: network.wifi.bind('enabled').as(enabled => `wifi ${enabled ? '' : 'disabled'}`),
            cursor: 'pointer',
            onPrimaryClick: () => Utils.execAsync('networkmanager_dmenu'),
            onSecondaryClick: () => network.toggleWifi(),
            onScrollUp: () => {
                isReloading.value = true

                if (network.wifi.enabled){
                    if(network.wifi.state != 'unavailable')
                        network.wifi.scan()
                }
                else
                    network.toggleWifi()
                Utils.timeout(1000, () => {
                    isReloading.value = false
                })
            },
            tooltipText: networkData.bind().as((network: Network) => network.name),
            child: Widget.Stack({
                children: {
                    'wifi': Widget.Label({
                        yalign: 0.6,
                        label: networkData.bind().as((network: Network) => network.icon),
                    }),
                    'reload': Widget.Spinner()
                },
                shown: isReloading.bind().as(isReloading => (isReloading ? 'reload': 'wifi')),
                transition: 'slide_up_down',
                transitionDuration: 350,
            })
        }),
    ]
})
