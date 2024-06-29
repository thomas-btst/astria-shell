import { withDigits } from "utils/utils"

const battery = await Service.import('battery')

const icons = { // TITOCHECK
    charging: ['', '', '', '', ''],
    discharging: ['', '', ''],
    low: ['', ''],
    full: ''
}

enum BatteryState{
    CHARGING = "charging",
    DISCHARGING = "discharging",
    LOW = "low",
    FULL = "full",
}

const batteryPercent = battery.bind('percent').as(p => p > 0 ? p : 0)

const batteryState = Utils.merge([battery.bind('charging'), batteryPercent],
    (charging, percent) => {
        if (percent == 100)
            return BatteryState.FULL
        if (charging)
            return BatteryState.CHARGING
        if (percent <= 15)
            return BatteryState.LOW
        return BatteryState.DISCHARGING
    }
)

let batteryIndex = Variable({
    iteration: 0,
    state: BatteryState.DISCHARGING,
})

Utils.interval(1000, () => {batteryIndex.setValue({
    iteration: ++batteryIndex.value.iteration,
    state: batteryIndex.value.state
})})

const batteryIcon = Utils.merge([batteryState, batteryPercent, batteryIndex.bind()],
    (state, percent, index) => {
        if (state != batteryIndex.value.state)
            batteryIndex.setValue({
                iteration: 0,
                state
            })
        switch (state) {
            case BatteryState.FULL: return icons.full
            case BatteryState.CHARGING: return icons.charging[index.iteration % icons.charging.length]
            case BatteryState.LOW: return icons.low[index.iteration % icons.low.length]
            case BatteryState.DISCHARGING: return icons.discharging[Math.trunc(percent * icons.discharging.length / 100)]
        }
    }
)

const batteryLevel = Utils.merge([batteryState, batteryPercent],
    (state, percent) => (state == BatteryState.FULL ? 'Plein' : `${percent.toString()}%`)
)

const batteryTimeToEmpty = battery.bind('time_remaining').as(seconds => {
    const totalMinutes = Math.trunc(seconds / 60)
    const minutes = totalMinutes % 60
    const hours = Math.trunc(totalMinutes / 60)
    return `${withDigits(hours)}:${withDigits(minutes)}`
})

export const BatteryTray = () => Widget.Button({
    className: 'battery',
    cursor: 'pointer',
    onPrimaryClick: () => Utils.execAsync('alacritty -e bpytop'),
    tooltipText: batteryTimeToEmpty,
    child: Widget.Box({
        className: batteryState,
        visible: battery.bind('available'),
        spacing: 6,
        children: [
            Widget.Label({
                className: 'icon',
                yalign: 0.6,
                label: batteryIcon,
            }),
            Widget.Label({
                className: 'label',
                label: batteryLevel,
            })
        ]
    })
})