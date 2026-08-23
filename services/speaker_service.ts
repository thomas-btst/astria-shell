import { getter, register } from "ags/gobject"
import AstalWp from "gi://AstalWp?version=0.1"
import GObject from "ags/gobject"

@register()
export class Speaker extends GObject.Object {
    private audio = AstalWp.get_default()

    private static instance: Speaker | undefined = undefined

    static get_default() {
        if (!this.instance) this.instance = new Speaker()

        return this.instance
    }

    @getter(Boolean)
    get isDefault() {
        return this.audio.defaultSpeaker.name === null
    }

    @getter(String)
    get icon() {
        const speaker = this.audio.defaultSpeaker
        if (this.isDefault || speaker.mute) return speaker.volumeIcon
        return "audio-headphones-symbolic"
    }

    constructor() {
        super()

        const connectSpeakerEvents = () => {
            const speaker = this.audio.defaultSpeaker
            const nameSub = speaker.connect("notify::name", () => {
                this.notify("is-default")
            })
            const muteSub = speaker.connect("notify::mute", () => {
                this.notify("icon")
            })
            const volumeSub = speaker.connect("notify::volume", () => {
                this.notify("icon")
            })
            return {
                speaker,
                nameSub,
                muteSub,
                volumeSub,
            }
        }

        let subs = connectSpeakerEvents()

        this.connect("notify::is-default", () => {
            this.notify("icon")
        })

        this.audio.connect("notify::default-speaker", () => {
            this.notify("is-default")
            this.notify("icon")
            subs.speaker.disconnect(subs.nameSub)
            subs.speaker.disconnect(subs.muteSub)
            subs.speaker.disconnect(subs.volumeSub)
            subs = connectSpeakerEvents()
        })
    }
}
