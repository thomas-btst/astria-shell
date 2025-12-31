import { Accessor, createBinding, createComputed, createState, For } from "ags"
import { Gtk } from "ags/gtk4"
import AstalHyprland from "gi://AstalHyprland"
import { Cursor } from "../../../../utils/gtk"
import { Utils } from "../../../../utils/utils"

interface WorkspaceButtonProps {
    workspaceId: number
    isFocused?: Accessor<boolean>
    children: JSX.Element
}

function WorkspaceButton({ workspaceId, isFocused, children }: WorkspaceButtonProps) {
    const hyprland = AstalHyprland.get_default()

    return (
        <button
            class="workspace"
            tooltipText={workspaceId.toString()}
            cursor={Cursor.POINTER}
            onClicked={() => {
                if (isFocused?.get()) hyprland.dispatch("togglespecialworkspace", "magic")
                else hyprland.dispatch("workspace", workspaceId.toString())
            }}
        >
            {children}
        </button>
    )
}

export function WorkspacesModule() {
    const hyprland = AstalHyprland.get_default()

    const hyprlandWorkspaces = createBinding(hyprland, "workspaces")
    const hyprlandWorkspacesMap = hyprlandWorkspaces((ws) => new Map(ws.map((w) => [w.id, w])))
    const workspaces = hyprlandWorkspaces((ws) => {
        const last = ws.reduce((max, current) => (current.id > max.id ? current : max))
        return Array.from({ length: last.id }, (_, i) => i + 1)
    })
    const remainingWorkspaces = workspaces((ws) =>
        Array.from({ length: Math.max(0, 10 - ws.length) }, (_, i) => i + ws.length + 1),
    )
    const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
    const isSpecial = Utils.unnestBinding(
        createBinding(
            hyprland,
            "focusedClient",
        )((client: AstalHyprland.Client | null) => {
            if (client)
                return Utils.unnestBinding(
                    createBinding(
                        client,
                        "workspace",
                    )((w: AstalHyprland.Workspace | null) => {
                        if (w) return createBinding(w, "id")((id) => id < 0)
                        else return createState(false)[0]
                    }),
                )
            else return createState(false)[0]
        }),
    )

    return (
        <box class="workspaces">
            <box>
                <For each={workspaces}>
                    {(wId) => {
                        const isFocused = focusedWorkspace((fw) => fw.id === wId)
                        const isUnoccupied = hyprlandWorkspacesMap((ws) => !ws.has(wId))
                        return (
                            <WorkspaceButton workspaceId={wId} isFocused={isFocused}>
                                <box
                                    cssClasses={createComputed((get) =>
                                        Utils.classNames(
                                            get(isFocused) && "focused",
                                            get(isUnoccupied) && "unoccupied",
                                            get(isSpecial) && "special",
                                        ),
                                    )}
                                    valign={Gtk.Align.CENTER}
                                >
                                    <revealer
                                        revealChild={isFocused}
                                        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
                                        transitionDuration={160}
                                    >
                                        <box />
                                    </revealer>
                                </box>
                            </WorkspaceButton>
                        )
                    }}
                </For>
            </box>
            <box>
                <For each={remainingWorkspaces}>
                    {(wId) => (
                        <WorkspaceButton workspaceId={wId}>
                            <box
                                cssClasses={isSpecial((isSpecial) =>
                                    Utils.classNames("hidden", isSpecial && "special"),
                                )}
                                valign={Gtk.Align.CENTER}
                            />
                        </WorkspaceButton>
                    )}
                </For>
            </box>
        </box>
    )
}
