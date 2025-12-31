import GObject, { register } from "ags/gobject"
import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import { Utils } from "../utils/utils"

@register()
export class Clock extends GObject.Object {
    private static instance: Clock | undefined = undefined

    static get_default() {
        if (!this.instance) this.instance = new Clock()

        return this.instance
    }

    private now() {
        return GLib.DateTime.new_now_local()
    }

    date = createPoll(this.now(), 1000, () => this.now())

    unixDate = this.date((date) => date.to_unix())

    parsedSeconds = this.date((date) => Utils.Number.withDigits(date.get_second()))

    parsedTimeHHMM = this.date(
        (date) => `${Utils.Number.withDigits(date.get_hour())}:${Utils.Number.withDigits(date.get_minute())}`,
    )

    parsedDateDDMMYYYY = this.date(
        (date) =>
            `${Utils.Number.withDigits(date.get_day_of_month())}/${Utils.Number.withDigits(date.get_month())}/${date.get_year().toString()}`,
    )
}
