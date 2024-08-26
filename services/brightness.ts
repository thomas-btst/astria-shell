import Gio from "types/@girs/gio-2.0/gio-2.0"
import { limitNumberWithinRange } from "utils/utils"

const path = '/sys/class/backlight'

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

    private interface = `${path}/${Utils.exec(`sh -c 'ls -w1 ${path} | head -1'`)}`

    private screenValue = 0
    private max = Number(Utils.readFile(`${this.interface}/max_brightness`))

    get screen_value() {
        return this.screenValue
    }

    set screen_value(percent: number) {
        if (percent != this.screenValue) {
            this.screenValue = limitNumberWithinRange(percent, 0.01, 1)
            try {
                const file = Gio.File.new_for_path(`${this.interface}/brightness`)
                const outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, Gio.Cancellable.new())
                const byteArray = new TextEncoder().encode(Math.trunc(this.screenValue * this.max).toString())
                outputStream.write_all(byteArray, Gio.Cancellable.new())
                outputStream.close(null)
                
            } catch (error) {
                console.error(`Failed to write file: ${this.interface}/brightness`)
                console.error(error)
            }
        }

        this.emit('changed')
        this.notify('screen-value')
        this.emit('screen-changed', this.screenValue)
    }

    constructor() {
        super()

        Utils.monitorFile(`${this.interface}/brightness`, () => this.onChange())

        this.onChange()
    }

    private async onChange() {
        this.screen_value = Number(Utils.readFile(`${this.interface}/brightness`)) / this.max
    }

    connect(event = 'screen-changed', callback) {
        return super.connect(event, callback)
    }
}

export const brightness = new BrightnessService