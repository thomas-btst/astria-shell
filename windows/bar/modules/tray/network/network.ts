const network = await Service.import('network')
// const wifiIcon = network.wifi.bind('strength').as(strength => strength.toString())
// tooltipText: network.wifi.bind('ssid').as(ssid => ssid ?? 'Déconnecté'),

// import { AGS_DIR } from "main"

network.bind('wifi').as((wifi) => {
    console.log(`Wifi: ${wifi}`)
})

interface Network {
    name: string,
    icon: string,
    isWired: boolean,
}

const reloadAngle = Variable(0, {
    // poll: [5, (self) => (self.value+1)%360]
})

const networkData = Variable(
    "{\"name\": \"\", \"icon\": \"󰤮\", \"isWired\": false}",
    {listen: ['bash', '/home/tito/.config/eww/scripts/getNetwork.sh']} // TITOCHECK
).bind().as(jsonStr => JSON.parse(jsonStr))

const isReloading = Variable(false)

export const NetworkTray = () => Widget.Box({
    className: 'network',
    children: [
        Widget.Revealer({
            className: 'ethernet',
            revealChild: networkData.as((network: Network) => network.isWired),
            transition: 'slide_right',
            transitionDuration: 440,
            child: Widget.Label({
                tooltipText: 'Ethernet',
                yalign: 0.6,
                label: '󰡪',
            })
        }),
        Widget.Button({
            className: 'wifi',
            cursor: 'pointer',
            onPrimaryClick: () => Utils.execAsync(['networkmanager_dmenu']),
            onSecondaryClick: () => network.toggleWifi(),
            onScrollUp: () => {
                isReloading.value = true
                network.wifi.scan()
                Utils.timeout(700, () => isReloading.value = false)
            },
            tooltipText: networkData.as((network: Network) => network.name),
            child: Widget.Stack({
                children: {
                    'reload': Widget.Label({
                        label: ' ', // 
                        angle: reloadAngle.bind(),
                    }),
                    'wifi': Widget.Label({
                        yalign: 0.6,
                        // label: wifiIcon,
                        label: networkData.as((network: Network) => network.icon),
                    }),
                },
                shown: isReloading.bind().as(isReloading => (isReloading ? 'reload': 'wifi')),
                transition: 'slide_up_down',
                // transition: isReloading.bind().as(isReloading => (isReloading ? 'slide_up' : 'slide_down')),
                transitionDuration: 350,
            })
        }),
    ]
})