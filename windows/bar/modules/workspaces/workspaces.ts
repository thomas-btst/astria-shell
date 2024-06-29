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
        const ws = Array(lastId).fill(WorkspaceState.UNOCCUPIED)
        workspaces.forEach(workspace => {
            ws[workspace.id-1] = workspace.current && WorkspaceState.FOCUSED || WorkspaceState.OCCUPIED
        })
        return ws
})

export const WorkspacesModule = () => Widget.Box({
    className: 'workspaces',
    children: workspaces.as(workspaces => 
        workspaces.map((workspace, id) => 
            Widget.Button({
                cursor: 'pointer',
                onClicked: () => hyprland.message(`dispatch workspace ${id + 1}`),
                child: Widget.Label({
                    className: workspace
                })
            })
        )
    )
})