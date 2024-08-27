export const date = Variable(Date.now(), {
    poll: [100, () => Date.now()]
})
date.stopPoll()

export const chrono: {
    begin: ReturnType<typeof Variable<number>>,
    time: ReturnType<typeof Variable<number>>,
    pause: ReturnType<typeof Variable<number | null>>,
    end: (begin?: number) => number,
    poll: {
        isPolling: () => boolean,
        start: () => void,
        stop: () => void,
    },
    timer: {
        start: () => void,
        play: () => void,
        pause: () => void,
        stop: () => void,
    },
    settings: {
        isPlaying: ReturnType<typeof Variable<boolean>>,
        time: {
            hours: ReturnType<typeof Variable<number>>,
            minutes: ReturnType<typeof Variable<number>>,
            seconds: ReturnType<typeof Variable<number>>,
        },
    }
} = {
    begin: Variable(0),
    time: Variable(0),
    pause: Variable<number | null>(null),
    end: (begin = chrono.begin.value): number => begin + chrono.time.value,
    poll: {
        isPolling: () => chrono.pause.value !== null,
        start: () => {
            if (chrono.pause.value !== null || !chrono.settings.isPlaying.value)
                date.startPoll()
        },
        stop: () => {
            if (chrono.pause.value === null && chrono.settings.isPlaying.value)
                date.stopPoll()
        }
    },
    timer: {
        start: () => {
            chrono.poll.start()
            chrono.time.value = ((chrono.settings.time.hours.value * 60 + chrono.settings.time.minutes.value) * 60 + chrono.settings.time.seconds.value) * 1000
            chrono.begin.setValue(date.value)
            chrono.settings.isPlaying.setValue(true)
            chrono.pause.setValue(null)
        },
        play: () => {
            chrono.poll.start()
            if (chrono.pause.value !== null)
                chrono.begin.value += date.value - chrono.pause.value
            chrono.pause.value = null
        },
        pause: () => {
            chrono.poll.stop()
            chrono.pause.value = date.value
        },
        stop: () => {
            chrono.poll.stop()
            chrono.settings.isPlaying.setValue(false)
        }
    },
    settings: {
        isPlaying: Variable(false),
        time: {
            hours: Variable(0),
            minutes: Variable(20),
            seconds: Variable(0),
        }
    }
}