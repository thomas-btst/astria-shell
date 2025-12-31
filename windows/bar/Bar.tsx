import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import { Env } from "../../utils/env"
import { ClockModule } from "./modules/clock/ClockModule"
import { SeparatorModule } from "./modules/separator/SeparatorModule"
import { PowerMenuModule } from "./modules/powermenu/PowerMenuModule"
import { WindowInfoModule } from "./modules/windowinfo/WindowInfoModule"
import { WorkspacesModule } from "./modules/workspaces/WorkspacesModule"
import { TraysModule } from "./modules/trays/TraysModule"

interface ModuleBoxProps {
    halign: Gtk.Align
    spacing?: number
    children?: JSX.Element[] | JSX.Element
}

function ModuleBox({ halign, spacing = 9, children }: ModuleBoxProps) {
    return (
        <box halign={halign} spacing={spacing}>
            {children}
        </box>
    )
}

function LeftModules() {
    return (
        <ModuleBox halign={Gtk.Align.START} spacing={12}>
            <PowerMenuModule />
            <WorkspacesModule />
        </ModuleBox>
    )
}

function CenterModules() {
    return (
        <ModuleBox halign={Gtk.Align.CENTER}>
            <WindowInfoModule />
        </ModuleBox>
    )
}

function RightModules() {
    return (
        <ModuleBox halign={Gtk.Align.END}>
            <TraysModule />
            <SeparatorModule />
            <ClockModule />
        </ModuleBox>
    )
}

export default function Bar() {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            name="bar"
            class="bar"
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            layer={Astal.Layer.TOP}
            margin_left={Env.margin}
            margin_right={Env.margin}
            margin_top={Env.margin}
            application={app}
        >
            <centerbox cssName="centerbox">
                <LeftModules $type="start" />
                <CenterModules $type="center" />
                <RightModules $type="end" />
            </centerbox>
        </window>
    )
}
