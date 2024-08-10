import { limitNumberWithinRange } from "utils/utils"

class BrightnessService extends Service {
    static {
        Service.register(
            this,
            {
                'screen-changed': ['float'],
            },
            {
                'screen-value': ['float', 'rw'],
            },
        )
    }

    private interface = Utils.exec("sh -c 'ls -w1 /sys/class/backlight | head -1'")

    private screenValue = 0
    private max = Number(Utils.exec('brightnessctl max'))

    get screen_value() {
        return this.screenValue
    }

    set screen_value(percent: number) {
        percent = limitNumberWithinRange(percent, 1, 100)

        Utils.execAsync(`brightnessctl set ${percent}% -q`)
        this.screenValue = percent
    }

    constructor() {
        super()

        Utils.monitorFile(`/sys/class/backlight/${this.interface}/brightness`, () => this.onChange())

        this.onChange()
    }

    private async onChange() {
        Utils.execAsync(['brightnessctl', 'get']).then(value => {
            this.screenValue = Number(value) / this.max * 100
            this.emit('changed')
            this.notify('screen-value')
    
            this.emit('screen-changed', this.screenValue)

            if (this.screenValue <= 0)
                this.screen_value = 1
        })
    }

    connect(event = 'screen-changed', callback) {
        return super.connect(event, callback)
    }
}

export const brightness = new BrightnessService