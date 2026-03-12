import { Accessor, createComputed, For } from "ags"
import { Gtk } from "ags/gtk4"
import { Cursor } from "../../../../utils/gtk"
import { Utils } from "../../../../utils/utils"
import { DesktopManager } from "../../../../services/desktop_manager/desktop_manager_service"
import { DesktopManagerInterface } from "../../../../services/desktop_manager/desktop_manager_interface"

interface WorkspaceButtonProps {
    id: number
    index: Accessor<number>
    state: Accessor<DesktopManagerInterface.Workspace.State>
}

function WorkspaceButton({ id, index, state }: WorkspaceButtonProps) {
    const desktopManager = DesktopManager.get_default()

    const isFocused = state((state) => state === DesktopManagerInterface.Workspace.State.FOCUSED)
    const isEmpty = state((state) => state === DesktopManagerInterface.Workspace.State.EMPTY)
    const isInactive = state((state) => state === DesktopManagerInterface.Workspace.State.INACTIVE)

    return (
        <button
            class="workspace"
            tooltipText={index((index) => index.toString())}
            cursor={Cursor.POINTER}
            onClicked={() => {
                desktopManager.focusWorkspace(id)
            }}
        >
            <box
                cssClasses={createComputed((get) =>
                    Utils.classNames(
                        get(isFocused) && "focused",
                        get(isEmpty) && "empty",
                        get(isInactive) && "hidden",
                        get(desktopManager.isSpecialWorkspace) && "special",
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
        </button>
    )
}

export function WorkspacesModule() {
    const desktopManager = DesktopManager.get_default()

    return (
        <box class="workspaces">
            <For each={desktopManager.workspaces} id={(workspace) => workspace.id}>
                {(workspace, index) => <WorkspaceButton id={workspace.id} index={index} state={workspace.state} />}
            </For>
        </box>
    )
}
