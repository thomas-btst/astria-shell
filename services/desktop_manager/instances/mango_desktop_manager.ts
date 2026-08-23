import { Accessor, createComputed, createState } from "ags"
import { DesktopManagerInterface } from "../desktop_manager_interface"
import { createSubprocess, execAsync } from "ags/process"

interface Client {
    appid: string | null
    title: string | null
    is_fullscreen?: boolean
}

interface Tag {
    index: number
    is_active: boolean
    client_count: number
}

interface MonitorTags {
    monitor: string
    tags: Tag[]
}

interface AllTags {
    all_tags: MonitorTags[]
}

enum Watcher {
    FOCUSING_CLIENT = "focusing-client",
    ALL_TAGS = "all-tags",
}

interface Workspace extends DesktopManagerInterface.Workspace {
    index: number
}

export class MangoDesktopManager implements DesktopManagerInterface {
    public displayWorkspacesPerMonitor = true

    public focusedClient: Accessor<DesktopManagerInterface.Client | null>

    public isSpecialWorkspace: Accessor<boolean>

    public workspaces: Accessor<Workspace[]>

    focusWorkspace(workspaceId: string): void {
        const workspace = this.workspaces().find(({ id }) => id === workspaceId)
        if (workspace == null) {
            console.error(`Failed to focus mango tag : tag ${workspaceId} does not exist`)
            return
        }
        execAsync(`mmsg dispatch view,${workspace.index.toString()}`).catch((e) => {
            console.error("Failed to focus mango tag :", e)
        })
    }

    constructor() {
        const tagsByMonitor = this.createIPCWatcher<AllTags>(Watcher.ALL_TAGS, { all_tags: [] })

        const tags = tagsByMonitor.as(({ all_tags }) =>
            all_tags.flatMap(({ monitor, tags }) => tags.map((tag) => ({ monitor, tag }))),
        )

        const tagsMap = tags.as(
            (tags) =>
                new Map<string, { monitor: string; tag: Tag }>(
                    tags.map(({ monitor, tag }) => [this.getWorkspaceId(monitor, tag.index), { monitor, tag }]),
                ),
        )

        const lastIndexByMonitor = tagsByMonitor.as<Map<string, number>>(
            ({ all_tags }) =>
                new Map<string, number>(
                    all_tags.map(({ monitor, tags }): [string, number] => {
                        const filteredTags = tags.filter((tag) => tag.client_count > 0 || tag.is_active)

                        if (filteredTags.length == 0) {
                            return [monitor, 0]
                        }

                        const lastIndex: number = filteredTags.reduce((max, current) =>
                            current.index > max.index ? current : max,
                        ).index

                        return [monitor, lastIndex]
                    }),
                ),
        )

        const focusedWorkspaces = tags.as<Set<string>>((tags) => {
            const focusedTags = tags.filter(({ tag }) => tag.is_active)
            return new Set(focusedTags.map(({ monitor, tag }) => this.getWorkspaceId(monitor, tag.index)))
        })

        this.focusedClient = this.createIPCWatcher<Client>(Watcher.FOCUSING_CLIENT, {
            appid: null,
            title: null,
        }).as<DesktopManagerInterface.Client | null>(({ appid, title, is_fullscreen }) => {
            if (appid == null || title == null) {
                return null
            }

            return {
                className: appid,
                title,
                isFullscreen: is_fullscreen ?? false,
            }
        })

        this.isSpecialWorkspace = createState(false)[0]

        this.workspaces = tags.as<Workspace[]>((tags) => {
            return tags.map(({ tag, monitor }): Workspace => {
                const { index } = tag
                const id = this.getWorkspaceId(monitor, index)

                const state = createComputed((get) => {
                    const lastIndex = get(lastIndexByMonitor).get(monitor) ?? 0
                    const clientCount = get(tagsMap).get(id)?.tag.client_count ?? 0

                    if (get(focusedWorkspaces).has(id)) {
                        return DesktopManagerInterface.Workspace.State.FOCUSED
                    }

                    if (clientCount == 0) {
                        if (index > lastIndex) {
                            return DesktopManagerInterface.Workspace.State.INACTIVE
                        }

                        return DesktopManagerInterface.Workspace.State.EMPTY
                    }

                    return DesktopManagerInterface.Workspace.State.OCCUPIED
                })

                return {
                    index,
                    id,
                    monitor: tagsMap((tags) => tags.get(id)?.monitor ?? monitor),
                    state,
                }
            })
        })
    }

    getWorkspaceId(monitor: string, index: number): string {
        return `${monitor} - ${index.toString()}`
    }

    createIPCWatcher<T>(event: Watcher, initialValue: T): Accessor<T> {
        return createSubprocess(JSON.stringify(initialValue), `mmsg watch ${event}`).as<T>(
            (data) => JSON.parse(data) as T,
        )
    }
}
