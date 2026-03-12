import { createState } from "ags"
import { DesktopManagerInterface } from "../desktop_manager_interface"

export class DefaultDesktopManager implements DesktopManagerInterface {
    public focusedClient = createState<DesktopManagerInterface.Client | null>(null)[0]
    public workspaces = createState<DesktopManagerInterface.Workspace[]>([
        { id: 1, state: createState(DesktopManagerInterface.Workspace.State.FOCUSED)[0] },
    ])[0]
    public isSpecialWorkspace = createState(false)[0]
    focusWorkspace(_: number): void {}
}
