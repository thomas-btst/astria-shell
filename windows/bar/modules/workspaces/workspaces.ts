const hyprland = await Service.import('hyprland')

enum WorkspaceState{
    FOCUSED = 'focused',
    OCCUPIED = 'occupied',
    UNOCCUPIED = 'unoccupied',
}

const workspaces = Utils.merge([hyprland.bind('workspaces'), hyprland.active.bind('workspace')], (workspaces, current) =>
        workspaces.filter(workspace =>
            workspace.id > 0
        ).sort((w1, w2) => w1.id - w2.id).map(workspace => ({
            id: workspace.id,
            current: current.id == workspace.id
        }))
).as(workspaces => {
        if (workspaces.length == 0)
            return []
        const lastId = workspaces[workspaces.length - 1].id
        const ws: WorkspaceState[] = Array(lastId).fill(WorkspaceState.UNOCCUPIED)
        workspaces.forEach(workspace => {
            ws[workspace.id-1] = workspace.current && WorkspaceState.FOCUSED || WorkspaceState.OCCUPIED
        })
        return ws
})

const Workspace = (id: number, className: string) => Widget.Button({
    cursor: 'pointer',
    onClicked: () => hyprland.message(`dispatch workspace ${id + 1}`),
    tooltip_text: (id + 1).toString(),
    child: Widget.Label({
        vpack: 'center',
        className
    })
})

export const WorkspacesModule = () => Widget.Box({
    className: 'workspaces',
    children: workspaces.as(workspaces =>
        [
            Widget.Box({
                children: workspaces.map((workspace, id) => Workspace(id, workspace))
            }),
            ...Array(Math.max(0, 10 - workspaces.length))
                .fill(WorkspaceState.UNOCCUPIED)
                .map((button, id) => Workspace(id + workspaces.length, `hidden ${WorkspaceState.UNOCCUPIED}`))
        ]
    )
})