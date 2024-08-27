import { QuickMenu } from "../quickmenu";
import { chrono } from "./chrono";
import { ClockPlaying } from "./playing/playing";
import { ClockStopped } from "./stopped/stopped";

export const ClockQuickMenu = new QuickMenu('clock',
    Widget.Box({
        className: 'clock',
        vertical: true,
        children: [
            Widget.Stack({
                children: {
                    stopped: ClockStopped,
                    playing: ClockPlaying,
                },
                shown: chrono.settings.isPlaying.bind().as(isPlaying => isPlaying ? 'playing' : 'stopped'),
                transition: 'over_down_up',
                transitionDuration: 400,
            }),
        ]
    })
)