import { monitorFile, readFile } from "ags/file"
import { getter, register } from "ags/gobject"
import { exec } from "ags/process"
import { Utils } from "../utils/utils"
import Gio from "gi://Gio"
import GObject from "gi://GObject?version=2.0"

const path = "/sys/class/backlight"

@register({ GTypeName: "Brightness" })
export class Brightness extends GObject.Object {
    private static instance: Brightness | undefined = undefined

    static get_default() {
        if (!this.instance) this.instance = new Brightness()

        return this.instance
    }

    private interface = `${path}/${exec(`sh -c 'ls -w1 ${path} | head -1'`)}`

    private screenMax = Number(readFile(`${this.interface}/max_brightness`))
    #screen = 0

    @getter(Number)
    get screen() {
        return this.#screen
    }

    set screen(percent) {
        if (this.#screen === percent) return
        this.#screen = Utils.Number.limitNumberWithinRange(percent, 0.01, 1)
        try {
            const file = Gio.File.new_for_path(`${this.interface}/brightness`)
            const outputStream = file.replace(null, false, Gio.FileCreateFlags.NONE, Gio.Cancellable.new())
            const byteArray = new TextEncoder().encode(Math.trunc(this.#screen * this.screenMax).toString())
            outputStream.write_all(byteArray, Gio.Cancellable.new())
            outputStream.close(null)
        } catch (error) {
            console.error(`Failed to write file: ${this.interface}/brightness`)
            console.error(error)
        }

        this.notify("screen")
    }

    constructor() {
        super()

        monitorFile(`${this.interface}/brightness`, () => {
            this.onChange()
        })

        this.onChange()
    }

    private onChange() {
        this.#screen = Number(readFile(`${this.interface}/brightness`)) / this.screenMax
        this.notify("screen")
    }
}
