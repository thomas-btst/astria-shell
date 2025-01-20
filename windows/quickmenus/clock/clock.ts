import { StackTransitionType } from "types/@girs/gtk-3.0/gtk-3.0.cjs";
import { QuickMenu } from "../quickmenu";
import { chrono } from "./chrono";
import { ClockPlaying } from "./playing/playing";
import { ClockStopped } from "./stopped/stopped";

export const ClockQuickMenu = new QuickMenu('clock',
    Widget.Overlay({
        className: 'clock',
        child: Widget.Box({
            className: 'content',
            vertical: true,
            child: Widget.Stack({
                children: {
                    stopped: ClockStopped,
                    playing: ClockPlaying,
                },
                shown: chrono.settings.isPlaying.bind().as(isPlaying => isPlaying ? 'playing' : 'stopped'),
                transition: 'over_down_up',
                transitionDuration: 400,
            }),
        }),
        overlay: Widget.Button({
            className: 'overlay',
            cursor: 'pointer',
            hpack: 'end',
            vpack: 'start',
            onPrimaryClick: () => ClockQuickMenu.close(),
            setup(self){
                const stack = self.child = Widget.Stack({
                    transitionType: StackTransitionType.CROSSFADE,
                    transitionDuration: 150,
                    children: {
                        logo: Widget.Label(''),
                        close: Widget.Label(''),
                    },
                    shown: 'logo'
                })
                self.on_hover = () => stack.shown = 'close'
                self.on_hover_lost = () => stack.shown = 'logo'
            }
        }).on('leave-notify-event', (self, event) => {
            self.on_hover_lost(self, event)
        })
    })
)