import { Accessor } from "ags"

export namespace DesktopManagerInterface {
    export interface Client {
        readonly className: string
        readonly title: string
        readonly isFullscreen: boolean
    }

    export namespace Workspace {
        export enum State {
            FOCUSED,
            OCCUPIED,
            EMPTY,
            INACTIVE,
        }
    }

    export interface Workspace {
        readonly id: string
        readonly monitor: Accessor<string | null>
        readonly state: Accessor<Workspace.State>
    }
}

export interface DesktopManagerInterface {
    readonly focusedClient: Accessor<DesktopManagerInterface.Client | null>
    readonly workspaces: Accessor<Array<DesktopManagerInterface.Workspace>>
    readonly isSpecialWorkspace: Accessor<boolean>
    readonly displayWorkspacesPerMonitor: boolean
    focusWorkspace(workspaceId: string): void
}
