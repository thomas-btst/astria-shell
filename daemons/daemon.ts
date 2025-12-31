import { Accessor } from "ags"

export interface Daemon<T> {
    start: () => void
    stop: () => void
    state: Accessor<T>
}
