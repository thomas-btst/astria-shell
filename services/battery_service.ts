import { getter, gtype, property, register } from "ags/gobject"
import AstalBattery from "gi://AstalBattery?version=0.1"
import GObject from "ags/gobject"
import { Utils } from "../utils/utils"

@register()
export class Battery extends GObject.Object {
    private battery = AstalBattery.get_default()

    private static instance: Battery | undefined = undefined

    static get_default() {
        if (!this.instance) this.instance = new Battery()

        return this.instance
    }

    @property(gtype<Battery.State>(String)) state = this.computeState()

    @getter(Number)
    get percent() {
        return Math.round(this.battery.percentage * 100)
    }

    @getter(String)
    get timeToEmptyOrFull() {
        const seconds = Math.max(this.battery.timeToFull, this.battery.timeToEmpty)
        const totalMinutes = Math.trunc(seconds / 60)
        const minutes = totalMinutes % 60
        const hours = Math.trunc(totalMinutes / 60)
        return `${Utils.Number.withDigits(hours)}:${Utils.Number.withDigits(minutes)}`
    }

    constructor() {
        super()

        this.battery.connect("notify::percentage", () => {
            this.updateState()
            this.notify("percent")
        })

        this.battery.connect("notify::charging", () => {
            this.updateState()
        })

        this.battery.connect("notify::time-to-empty", () => {
            this.notify("time-to-empty-or-full")
        })

        this.battery.connect("notify::time-to-full", () => {
            this.notify("time-to-empty-or-full")
        })
    }

    private computeState(): Battery.State {
        if (this.battery.charging) {
            if (this.battery.percentage === 1) return Battery.State.FULL
            if (this.battery.percentage >= 0.85) return Battery.State.ALMOST_FULL
            return Battery.State.CHARGING
        }
        if (this.battery.percentage <= 0.1) return Battery.State.VERY_VERY_LOW
        if (this.battery.percentage <= 0.1) return Battery.State.VERY_LOW
        if (this.battery.percentage <= 0.2) return Battery.State.LOW
        return Battery.State.DISCHARGING
    }

    private updateState() {
        const updatedState = this.computeState()
        if (updatedState !== this.state) {
            this.state = updatedState
        }
    }
}

export namespace Battery {
    export const State = Object.freeze({
        CHARGING: "charging",
        DISCHARGING: "discharging",
        LOW: "low",
        VERY_VERY_LOW: "very_very_low",
        VERY_LOW: "very_low",
        ALMOST_FULL: "almost_full",
        FULL: "full",
    })

    export type State = (typeof State)[keyof typeof State]
}
