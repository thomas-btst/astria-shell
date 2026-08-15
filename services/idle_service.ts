import { Process, subprocess } from "ags/process"
import { Accessor, createState, Setter } from "gnim"
import GObject, { getter, register, setter } from "ags/gobject"

@register()
export class Idle extends GObject.Object {
    private static instance: Idle | undefined = undefined

    static get_default() {
        if (!this.instance) this.instance = new Idle()
        return this.instance
    }

    private process: Process | null = null

    @getter(Boolean)
    get enabled(): boolean {
        return this.process === null
    }

    @getter(String)
    get icon(): string {
        return `changes-${this.enabled ? "prevent" : "allow"}-symbolic`
    }

    @setter(Boolean)
    set enabled(enabled: boolean) {
        if (enabled) this.enable()
        else this.disable()
    }

    private notifyEnabled() {
        this.notify("enabled")
        this.notify("icon")
    }

    private enable() {
        if (!this.process) return
        this.process.kill()
        this.process = null
        this.notifyEnabled()
    }

    private disable() {
        if (this.process) return
        this.process = subprocess('systemd-inhibit --what=idle --who="AGS" --why="Inhibit screen idle" sleep infinity')
        this.process.connect("exit", () => {
            this.process = null
        })
        this.notifyEnabled()
    }
}
