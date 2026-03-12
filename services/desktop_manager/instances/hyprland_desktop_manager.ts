import AstalHyprland from "gi://AstalHyprland?version=0.1"
import { DesktopManagerInterface } from "../desktop_manager_interface"
import { Accessor, createBinding, createComputed } from "ags"

export class HyrplandDesktopManager implements DesktopManagerInterface {
    private hyprland = AstalHyprland.get_default()

    public focusedClient: Accessor<DesktopManagerInterface.Client | null>

    public isSpecialWorkspace: Accessor<boolean>

    public workspaces: Accessor<DesktopManagerInterface.Workspace[]>

    focusWorkspace(workspaceId: number): void {
        const focusedWorkspace = this.workspaces().find(
            (workspace) => workspace.state() === DesktopManagerInterface.Workspace.State.FOCUSED,
        )
        if (focusedWorkspace?.id === workspaceId) this.hyprland.dispatch("togglespecialworkspace", "magic")
        else this.hyprland.dispatch("workspace", workspaceId.toString())
    }

    constructor() {
        const focusedClientBinding: Accessor<AstalHyprland.Client | null> = createBinding(
            this.hyprland,
            "focusedClient",
        )
        this.focusedClient = createComputed<DesktopManagerInterface.Client | null>((get) => {
            const focusedClient = get(focusedClientBinding)
            if (focusedClient === null) return null
            const className = get(createBinding(focusedClient, "class"))
            const fullscreen = get(createBinding(focusedClient, "fullscreen"))
            return {
                className,
                isFullscreen: fullscreen === AstalHyprland.Fullscreen.FULLSCREEN,
            }
        })

        this.isSpecialWorkspace = createComputed((get) => {
            const focusedClient = get(focusedClientBinding)
            if (focusedClient === null) return false
            const workspace = get<AstalHyprland.Workspace | null>(createBinding(focusedClient, "workspace"))
            if (workspace === null) return false
            return workspace.id < 0
        })

        const hyprlandWorkspaces = createBinding(this.hyprland, "workspaces")
        const hyprlandWorkspacesMap = hyprlandWorkspaces((ws) => new Map(ws.map((w) => [w.id, w])))
        const lastWorkspace = hyprlandWorkspaces((workspaces) =>
            workspaces.reduce((max, current) => (current.id > max.id ? current : max)),
        )
        const workspaces = Array.from({ length: 10 }, (_, i) => i + 1)
        const focusedWorkspace = createBinding(this.hyprland, "focusedWorkspace")

        this.workspaces = createComputed<DesktopManagerInterface.Workspace[]>(() =>
            workspaces.map<DesktopManagerInterface.Workspace>((id) => {
                const isFocused = focusedWorkspace((fw) => fw.id === id)
                const isUnoccupied = hyprlandWorkspacesMap((ws) => !ws.has(id))
                return {
                    id,
                    state: createComputed((get) => {
                        if (get(isFocused)) return DesktopManagerInterface.Workspace.State.FOCUSED
                        if (get(isUnoccupied))
                            if (id > get(lastWorkspace).id) return DesktopManagerInterface.Workspace.State.INACTIVE
                            else return DesktopManagerInterface.Workspace.State.EMPTY
                        return DesktopManagerInterface.Workspace.State.OCCUPIED
                    }),
                }
            }),
        )
    }
}
