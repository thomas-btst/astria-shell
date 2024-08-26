import { ArgumentTypes, ConstructorParams } from "utils/utils";

export const margins = 11

type WindowParams = ArgumentTypes<typeof Widget.Window>[0]

export class Window{
    public readonly Bar: () => ReturnType<typeof Widget.Window>

    private revealer?: {
        reveal: ReturnType<typeof Variable<any>>,
        duration: number,
    }

    constructor(
        public readonly name: string,
        window: WindowParams,
        params?: {
            onWindowToggle?: () => void
            apply?: (window: ReturnType<typeof Widget.Window>) => ReturnType<typeof Widget.Window>,
            transition?: {
                type: 'none' | 'crossfade' | 'slide_right' | 'slide_left' | 'slide_up' | 'slide_down',
                duration: number,
            }
        }
    ) {
        if (window !== undefined) {
            window.name = name
            if (window.className === undefined)
                window.className = name

            if (params?.transition !== undefined){
                this.revealer = {
                    reveal: Variable(window.visible),
                    duration: params.transition.duration,
                }

                window.child = Widget.Box({
                    css: 'padding: 0.1px;',
                    hpack: 'center',
                    child: Widget.Revealer({
                            revealChild: this.revealer.reveal.bind(),
                            transition: params.transition.type,
                            transitionDuration: params.transition.duration,
                            child: window.child,
                        }),
                })
            }
        }

        this.Bar = () => {
            const Window = Widget.Window(window)
            if (params?.onWindowToggle !== undefined)
                Window.hook(App, (self, windowName) => {
                    if (windowName === this.name)
                        params.onWindowToggle!!()
                }, 'window-toggled')
            if (params?.apply !== undefined)
                return params.apply(Window)
            return Window
        }
    }

    get isOpen() {
        return App.getWindow(this.name)?.visible ?? false
    }

    open() {
        if(this.revealer !== undefined){
            App.openWindow(this.name)
            this.revealer.reveal.value = true
        } else App.openWindow(this.name)
    }

    close() {
        if(this.revealer !== undefined){
            Utils.timeout(this.revealer.duration, () => App.closeWindow(this.name))
            this.revealer.reveal.value = false
        } else App.closeWindow(this.name)
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }
}

export class MultiWindow extends Window {
    private static others: Map<string, MultiWindow[]> = new Map()

    constructor(private _class, ...[name,...params]: ConstructorParams<typeof Window>){
        super(`${_class}-${name}`, ...params)

        if (!MultiWindow.others.has(_class))
            MultiWindow.others.set(_class, [])
        MultiWindow.others.get(_class)!!.push(this)
    }

    protected closeOthers() {
        MultiWindow.others.get(this._class)!!.filter(other => other.name != this.name).forEach(other => {
            if (other.isOpen)
                other.close()
        })
    }
}