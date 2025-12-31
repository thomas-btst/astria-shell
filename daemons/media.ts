import Mpris from "gi://AstalMpris"
import Wp from "gi://AstalWp"
import { createBinding } from "ags"
import { Speaker } from "../services/speaker_service"
import { Utils } from "../utils/utils"

export const MediaDaemon = () => {
    const mpris = Mpris.get_default()
    const audio = Wp.get_default()
    const speaker = Speaker.get_default()

    let lastId: number = audio.defaultSpeaker.id
    Utils.unnestBinding(createBinding(audio, "defaultSpeaker")((speaker) => createBinding(speaker, "id"))).subscribe(
        () => {
            const id = audio.defaultSpeaker.id
            if (lastId === id) return
            lastId = id
            if (speaker.isDefault)
                mpris.players.forEach((player) => {
                    if (player.playbackStatus === Mpris.PlaybackStatus.PLAYING) player.pause()
                })
        },
    )
}
