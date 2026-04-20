import { Accessor } from "ags"
import { Gdk } from "ags/gtk4"

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
        readonly id: number
        readonly monitor: string | null
        readonly state: Accessor<Workspace.State>
    }
}

export interface DesktopManagerInterface {
    readonly focusedClient: Accessor<DesktopManagerInterface.Client | null>
    readonly workspaces: Accessor<Array<DesktopManagerInterface.Workspace>>
    readonly isSpecialWorkspace: Accessor<boolean>
    focusWorkspace(workspaceId: number): void
    workspacesByMonitor(monitor: Gdk.Monitor): Accessor<DesktopManagerInterface.Workspace[]>
}
