const mpris = await Service.import('mpris')
const audio = await Service.import('audio')

export const MediaDaemon = () => {
    let current = 1
    audio.connect('speaker-changed', (audio) => {
        if (current === audio.speaker.id) return

        current = audio.speaker.id ?? current
        
        if (audio.speaker.id === 1)
            mpris.players.forEach(player => {
                if (player.play_back_status === 'Playing')
                    player.playPause()
            })
    })
}
