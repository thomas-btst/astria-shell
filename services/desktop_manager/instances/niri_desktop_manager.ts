import { Accessor, createComputed, createState, Setter } from "ags"
import { DesktopManagerInterface } from "../desktop_manager_interface"
import Gio from "gi://Gio?version=2.0"
import GLib from "gi://GLib?version=2.0"

const NIRI_SOCKET = "NIRI_SOCKET"

namespace Answer {
    export interface Event {
        [event: string]: unknown
    }

    export interface Request {
        Ok?: Record<string, unknown>
    }
}

type Answer = Answer.Event | Answer.Request

enum Request {
    EVENT_STREAM = "EventStream",
    FOCUSED_WINDOW = "FocusedWindow",
    WORKSPACES = "Workspaces",
    ACTION = "Action",
}

enum Action {
    FOCUS_WORKSPACE = "FocusWorkspace",
}

enum Event {
    WINDOW_LAYOUTS_CHANGED = "WindowLayoutsChanged",
    WINDOW_FOCUS_CHANGED = "WindowFocusChanged",
    WINDOW_OPENED_OR_CHANGED = "WindowOpenedOrChanged",
    WORKSPACE_ACTIVE_WINDOW_CHANGED = "WorkspaceActiveWindowChanged",
    WORKSPACES_CHANGED = "WorkspacesChanged",
    WORKSPACE_ACTIVATED = "WorkspaceActivated",
    OVERVIEW_OPENED_OR_CLOSED = "OverviewOpenedOrClosed",
}

interface FocusedWindow {
    id: number
    title: string
    app_id: string
    workspace_id: number
    is_focused: boolean
    layout: {
        window_offset_in_tile: [number, number]
    }
}

interface Workspace {
    id: number
    idx: number
    is_active: boolean
    is_focused: boolean
    active_window_id: number | null
}

interface Overview {
    is_open: boolean
}

export class NiriDesktopManager implements DesktopManagerInterface {
    private socketPath = GLib.getenv(NIRI_SOCKET)

    public focusedClient: Accessor<DesktopManagerInterface.Client | null>
    private setFocusedClient: Setter<DesktopManagerInterface.Client | null>

    public isSpecialWorkspace: Accessor<boolean>
    private setIsSpecialWorkspace: Setter<boolean>

    public workspaces: Accessor<DesktopManagerInterface.Workspace[]>
    private setWorkspaces: Setter<DesktopManagerInterface.Workspace[]>

    private focusedWorkspaces: Accessor<Set<number>>
    private setFocusedWorkspaces: Setter<Set<number>>

    private emptyWorkspaces: Accessor<Set<number>>
    private setEmptyWorkspaces: Setter<Set<number>>

    focusWorkspace(workspaceId: number): void {
        this.actionNiriSocket(Action.FOCUS_WORKSPACE, { reference: { Index: workspaceId } }).catch((e) => {
            console.error("Failed to focus niri workspace :", e)
        })
    }

    constructor() {
        ;[this.focusedClient, this.setFocusedClient] = createState<DesktopManagerInterface.Client | null>(null)
        ;[this.isSpecialWorkspace, this.setIsSpecialWorkspace] = createState(false)
        ;[this.workspaces, this.setWorkspaces] = createState<DesktopManagerInterface.Workspace[]>([])
        ;[this.focusedWorkspaces, this.setFocusedWorkspaces] = createState(new Set())
        ;[this.emptyWorkspaces, this.setEmptyWorkspaces] = createState(new Set())
        this.handleNiriEvents()
        this.updateFocusedClient()
        this.updateWorkspaces()
    }

    private updateFocusedClient() {
        this.requestNiriSocket<FocusedWindow | null>(Request.FOCUSED_WINDOW)
            .then((data) => {
                let client: DesktopManagerInterface.Client | null = null
                if (data) {
                    const [offsetX, offsetY] = data.layout.window_offset_in_tile
                    client = {
                        className: data.app_id,
                        title: data.title,
                        isFullscreen: offsetX === 0 && offsetY === 0,
                    }
                }
                this.setFocusedClient(client)
            })
            .catch((e) => {
                console.error("Error when updating niri focused client :", e)
            })
    }

    private updateWorkspaces() {
        this.requestNiriSocket<Workspace[]>(Request.WORKSPACES)
            .then((workspaces) => {
                const hasSetChanged = (updatedSet: number[], oldSet: Set<number>) =>
                    updatedSet.length !== oldSet.size || updatedSet.some((workspace) => !oldSet.has(workspace))

                const focusedWorkspaces = workspaces
                    .filter((workspace) => workspace.is_focused)
                    .map((workspace) => workspace.id)

                const emptyWorkspaces = workspaces
                    .filter((workspace) => workspace.active_window_id === null)
                    .map((workspace) => workspace.id)

                if (hasSetChanged(focusedWorkspaces, this.focusedWorkspaces()))
                    this.setFocusedWorkspaces(new Set(focusedWorkspaces))

                if (hasSetChanged(emptyWorkspaces, this.emptyWorkspaces()))
                    this.setEmptyWorkspaces(new Set(emptyWorkspaces))

                const ws = workspaces
                    .sort((w1, w2) => w1.idx - w2.idx)
                    .map(({ id }) => ({
                        id,
                        state: createComputed((get) => {
                            if (get(this.focusedWorkspaces).has(id))
                                return DesktopManagerInterface.Workspace.State.FOCUSED
                            if (get(this.emptyWorkspaces).has(id))
                                return DesktopManagerInterface.Workspace.State.INACTIVE
                            return DesktopManagerInterface.Workspace.State.OCCUPIED
                        }),
                    }))
                    .filter(
                        (workspace, i) =>
                            i !== 0 || workspace.state() !== DesktopManagerInterface.Workspace.State.INACTIVE,
                    )

                if (
                    ws.length !== this.workspaces().length ||
                    ws.some((workspace, i) => workspace.id !== this.workspaces()[i].id)
                )
                    this.setWorkspaces(ws)
            })
            .catch((e) => {
                console.error("Error when updating niri workspaces :", e)
            })
    }

    private updateOverview({ is_open }: Overview) {
        this.setIsSpecialWorkspace(is_open)
    }

    private handleNiriEvents() {
        this.connectNiriSocket(Request.EVENT_STREAM, null, true, (anwser) => {
            Object.entries(anwser).forEach(([event, data]) => {
                switch (event) {
                    case Event.WINDOW_FOCUS_CHANGED.toString():
                        this.updateFocusedClient()
                        break
                    case Event.WORKSPACE_ACTIVE_WINDOW_CHANGED.toString():
                        this.updateFocusedClient()
                        break
                    case Event.WINDOW_OPENED_OR_CHANGED.toString():
                        this.updateFocusedClient()
                        break
                    case Event.WINDOW_LAYOUTS_CHANGED.toString():
                        this.updateFocusedClient()
                        break
                    case Event.WORKSPACES_CHANGED.toString():
                        this.updateWorkspaces()
                        break
                    case Event.WORKSPACE_ACTIVATED.toString():
                        this.updateWorkspaces()
                        break
                    case Event.OVERVIEW_OPENED_OR_CLOSED.toString():
                        this.updateOverview(data as Overview)
                        break
                    default:
                        break
                }
            })
        })
    }

    private async actionNiriSocket(action: Action, data: unknown) {
        return new Promise<void>((resolve, reject) => {
            this.connectNiriSocket(Request.ACTION, { [action]: data }, false, (answer) => {
                if (answer.Ok) resolve()
                else reject(Error("Niri action failed: answer is :" + JSON.stringify(answer)))
            })
        })
    }

    private async requestNiriSocket<T>(request: Request): Promise<T> {
        return new Promise((resolve, reject) => {
            this.connectNiriSocket(request, null, false, (answer: Answer.Request) => {
                if (answer.Ok && request in answer.Ok) resolve(answer.Ok[request] as T)
                else reject(new Error("Failed to parse niri socket answser:" + JSON.stringify(answer)))
            })
        })
    }

    private connectNiriSocket(request: Request, data: unknown, loop: boolean, callback: (answer: Answer) => void) {
        const client = new Gio.SocketClient()

        if (this.socketPath === null) {
            console.error("Failed to connect to niri socket: socket path is not found")
            return
        }

        client.connect_async(Gio.UnixSocketAddress.new(this.socketPath), null, (source_object, res) => {
            if (source_object === null) {
                console.error("Failed to connect to niri socket")
                return
            }

            let connection: Gio.SocketConnection
            try {
                connection = source_object.connect_finish(res)
            } catch (e) {
                console.error("Failed to finish niri socket connection:", e)
                return
            }

            const outStream = new Gio.DataOutputStream({ base_stream: connection.get_output_stream() })
            const inStream = new Gio.DataInputStream({ base_stream: connection.get_input_stream() })

            let fullRequest: unknown = request
            if (data != null) fullRequest = { [request]: data }
            outStream.put_string(`${JSON.stringify(fullRequest)}\n`, null)
            outStream.flush_async(GLib.PRIORITY_DEFAULT, null, (flush_source, flush_res) => {
                try {
                    outStream.flush_finish(flush_res)
                } catch (e) {
                    console.error("Failed to flush niri socket:", e)
                    return
                }

                let firstCall = true

                const readNext = () => {
                    if (!firstCall && !loop) {
                        connection.close_async(GLib.PRIORITY_DEFAULT, null, null)
                        return
                    }
                    firstCall = false

                    inStream.read_line_async(GLib.PRIORITY_DEFAULT, null, (stream_source, read_res) => {
                        let line: string | null = null
                        if (stream_source !== null) {
                            try {
                                ;[line] = stream_source.read_line_finish_utf8(read_res)
                            } catch (e) {
                                console.error("Error finishing read from niri socket stream :", e)
                                connection.close_async(GLib.PRIORITY_DEFAULT, null, null)
                                return
                            }
                        }

                        try {
                            if (line !== null) callback(JSON.parse(line) as Answer)
                            else callback({})
                        } catch {
                            console.error("Failed to parse niri socket message :", line)
                        }

                        readNext()
                    })
                }

                readNext()
            })
        })
    }
}
