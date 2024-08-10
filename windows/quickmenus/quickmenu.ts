import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { margins, MultiWindow } from "windows/window";

export class QuickMenu extends MultiWindow {
    constructor(
        name: string,
        child: Gtk.Widget,
    ) {
        super('quickmenu',
            name,
            {
                visible: false,
                anchor: ['top', 'right'],
                layer: 'overlay',
                margins: [margins],
                monitor: 0,
                child: child,
            },
            {
                transition: {
                    type: 'slide_left',
                    duration: 350,
                }
            }
        )
    }

    open(){
        this.closeOthers()
        super.open()
    }
}
