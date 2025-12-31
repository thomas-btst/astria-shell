import { Astal, Gdk, Gtk } from "ags/gtk4"
import { Locker } from "../utils/locker"
import { Accessor, CCProps, createState, Node, Setter } from "ags"
import { timeout } from "ags/time"

type Props<T extends Gtk.Widget, Props> = CCProps<T, Partial<Props>>

interface RevealerProps extends Omit<Props<Gtk.Revealer, Gtk.Revealer.ConstructorProps>, "revealChild"> {
    transitionType: Gtk.RevealerTransitionType
    transitionDuration: number
}

interface WindowOverlayProps extends Omit<Props<Astal.Window, Astal.Window.ConstructorProps>, "children"> {
    class: string | Accessor<string>
    visible?: boolean
    revealer: RevealerProps
    onWindowOpen?: () => void
    onWindowClose?: () => void
    onKeyPressed?: (
        source: Gtk.EventControllerKey,
        arg0: number,
        arg1: number,
        arg2: Gdk.ModifierType,
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ) => boolean | void
    children: () => Node
}

export class WindowOverlay {
    private animationLocker = new Locker()

    protected reveal: Accessor<boolean>
    protected setReveal: Setter<boolean>
    protected visible: Accessor<boolean>
    protected setVisible: Setter<boolean>

    constructor(private props: WindowOverlayProps) {
        const visible = props.visible ?? false
        const [reveal, setReveal] = createState(visible)
        this.reveal = reveal
        this.setReveal = setReveal

        const [_visible, setVisible] = createState(visible)
        this.visible = _visible
        this.setVisible = setVisible
    }

    public Window() {
        const { visible, revealer, onWindowClose, onWindowOpen, onKeyPressed, ...props } = this.props
        return (
            <window {...props} visible={this.visible}>
                <revealer revealChild={this.reveal} {...revealer}>
                    {props.children()}
                </revealer>
                <Gtk.EventControllerKey onKeyPressed={onKeyPressed} />
            </window>
        )
    }

    get isOpen() {
        return this.reveal.get()
    }

    get isNotAnimating() {
        return !this.animationLocker.isLocked
    }

    open() {
        this.setVisible(true)
        this.setReveal(true)
        this.props.onWindowOpen?.()
        this.animationLocker.lock(this.props.revealer.transitionDuration)
    }

    close() {
        this.props.onWindowClose?.()
        this.setReveal(false)
        timeout(this.props.revealer.transitionDuration, () => {
            if (!this.animationLocker.isLocked) this.setVisible(false)
        })
    }

    toggle() {
        if (this.isOpen) this.close()
        else this.open()
    }
}

export class MultiWindowOverlay extends WindowOverlay {
    private static others: Map<string, MultiWindowOverlay[]> = new Map()

    constructor(
        private _class: string,
        params: WindowOverlayProps,
    ) {
        super(params)

        let group = MultiWindowOverlay.others.get(_class)
        if (!group) {
            group = []
            MultiWindowOverlay.others.set(_class, group)
        }
        group.push(this)
    }

    override open() {
        MultiWindowOverlay.others
            .get(this._class)
            ?.filter((other) => other != this)
            .forEach((other) => {
                other.close()
            })
        super.open()
    }

    override toggle() {
        if (this.isOpen) this.close()
        else this.open()
    }
}
