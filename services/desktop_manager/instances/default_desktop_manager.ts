import { createState } from "ags"
import { DesktopManagerInterface } from "../desktop_manager_interface"

export class DefaultDesktopManager implements DesktopManagerInterface {
    public displayWorkspacesPerMonitor = false
    public focusedClient = createState<DesktopManagerInterface.Client | null>(null)[0]
    public workspaces = createState<DesktopManagerInterface.Workspace[]>([
        {
            id: "1",
            monitor: createState(null)[0],
            state: createState(DesktopManagerInterface.Workspace.State.FOCUSED)[0],
        },
    ])[0]
    public isSpecialWorkspace = createState(false)[0]
    focusWorkspace(_: string): void {}
}
