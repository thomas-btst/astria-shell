import { Accessor, createBinding, createComputed, For, onCleanup } from "ags"
import { EthernetTray } from "./ethernet/EthernetTray"
import { WifiTray } from "./wifi/WifiTray"
import { BatteryTray } from "./battery/BatteryTray"
import { Gtk } from "ags/gtk4"
import { SpeakerTray } from "./audio/speaker/SpeakerTray"
import { MicrophoneTray } from "./audio/microphone/MicrophoneTray"
import { Cursor } from "../../../../utils/gtk"
import { Env } from "../../../../utils/env"
import GObject from "ags/gobject"
import { BluetoothTray } from "./bluetooth/BluetoothTray"
import { IdleTray } from "./idle/IdleTray"
import AstalTray from "gi://AstalTray?version=0.1"

export namespace TrayItem {
    export enum Status {
        Hidden,
        Visible,
        Collapsed,
    }
}

export interface TrayItem {
    Tray: () => GObject.Object
    status: Accessor<TrayItem.Status>
}

interface TrayProps {
    children: () => JSX.Element
    visible: Accessor<boolean>
}

interface CallapsedTraysProps {
    trays: Accessor<(() => GObject.Object)[]>
}

function CallapsedTrays({ trays }: CallapsedTraysProps) {
    const tray = AstalTray.get_default()

    const nativeTrays = createBinding(tray, "items")

    const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
        btn.menuModel = item.menuModel
        btn.insert_action_group("dbusmenu", item.actionGroup)
        const connectionId = item.connect("notify::action-group", () => {
            btn.insert_action_group("dbusmenu", item.actionGroup)
        })
        onCleanup(() => {
            item.disconnect(connectionId)
        })
    }

    const items = createComputed((get) => {
        return get(trays)
            .map((Tray) => () => (
                <box class="item">
                    <Tray />
                </box>
            ))
            .concat(
                get(nativeTrays).map((tray) => () => (
                    <menubutton
                        cursor={Cursor.POINTER}
                        $={(self) => {
                            init(self, tray)
                        }}
                        class="item"
                    >
                        <image gicon={createBinding(tray, "gicon")} pixelSize={Env.iconSize} />
                    </menubutton>
                )),
            )
    })

    return (
        <menubutton cursor={Cursor.POINTER} class="collapsed" valign={Gtk.Align.FILL}>
            <image iconName="pan-down-symbolic" pixelSize={Env.iconSize - 2} />
            <popover>
                <Gtk.FlowBox
                    maxChildrenPerLine={5}
                    minChildrenPerLine={5}
                    rowSpacing={6}
                    columnSpacing={6}
                    selectionMode={Gtk.SelectionMode.SINGLE}
                >
                    <For each={items}>{(Tray) => <Tray />}</For>
                </Gtk.FlowBox>
            </popover>
        </menubutton>
    )
}
// TODO finish to customize tray end buble

function VisibleTray({ children, visible }: TrayProps) {
    return (
        <revealer
            revealChild={visible}
            transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
            transitionDuration={440}
        >
            <box class="tray">{children()}</box>
        </revealer>
    )
}

export function TraysModule() {
    const trays: TrayItem[] = [
        BatteryTray,
        IdleTray,
        MicrophoneTray,
        SpeakerTray,
        BluetoothTray,
        EthernetTray,
        WifiTray,
    ]

    const callapsedTrays = createComputed((get) =>
        trays
            .map(({ status }) => get(status))
            .reduce((acc, status, i) => {
                if (status === TrayItem.Status.Collapsed) acc.push(trays[i].Tray)
                return acc
            }, new Array<() => GObject.Object>())
            .reverse(),
    )

    return (
        <box class="trays" spacing={4}>
            <CallapsedTrays trays={callapsedTrays} />
            <box class="visible">
                {trays.map(({ Tray, status }) => (
                    <VisibleTray visible={status((status) => status === TrayItem.Status.Visible)}>
                        {() => <Tray />}
                    </VisibleTray>
                ))}
            </box>
        </box>
    )
}
